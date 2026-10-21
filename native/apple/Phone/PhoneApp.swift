import SwiftUI
import WebKit
import LocalAuthentication
import WatchConnectivity
import ActivityKit
import UserNotifications

@main struct MacroPulseApp: App { var body: some Scene { WindowGroup { PhoneRoot() } } }
struct PhoneRoot: View {
    @StateObject private var bridge = PhoneBridge()
    @Environment(\.scenePhase) private var phase
    @AppStorage("biometricLock") private var biometricLock = false
    @State private var unlocked = false
    var body: some View {
        ZStack { PulseWeb(bridge: bridge).opacity(!biometricLock || unlocked ? 1 : 0)
            if biometricLock && !unlocked { VStack { Text("MacroPulse is locked").font(.title); Button("Unlock with device security") { unlock() } }.frame(maxWidth:.infinity,maxHeight:.infinity).background(Color.black) }
        }.onAppear { if biometricLock { unlock() } }.onChange(of: phase) { _, next in if next != .active { unlocked = false } else if biometricLock { unlock() } }
    }
    private func unlock() { let context = LAContext(); context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason:"Unlock your private MacroPulse screen") { success,_ in DispatchQueue.main.async { unlocked = success } } }
}
struct PulseWeb: UIViewRepresentable {
    let bridge: PhoneBridge
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration(); configuration.limitsNavigationsToAppBoundDomains = true
        configuration.userContentController.add(bridge, name: "macropulse")
        let view = WKWebView(frame: .zero, configuration: configuration); bridge.web = view; view.navigationDelegate = bridge
        view.load(URLRequest(url: URL(string:"https://joewalker989.github.io/MacroPulse/")!)); return view
    }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
@MainActor final class PhoneBridge: NSObject, ObservableObject, WKScriptMessageHandler, WKNavigationDelegate, WCSessionDelegate {
    weak var web: WKWebView?
    override init() { super.init(); if WCSession.isSupported() { WCSession.default.delegate = self; WCSession.default.activate() } }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.frameInfo.securityOrigin.protocol == "https", message.frameInfo.securityOrigin.host == "joewalker989.github.io", web?.url?.path.hasPrefix("/MacroPulse/") == true, let input = message.body as? [String:Any], let id = input["id"] as? String, id.count <= 100, let action = input["action"] as? String else { return }
        Task { do { var output: [String:Any] = [:]
            switch action {
            case "capabilities": output = ["healthKit":true,"widgets":true,"watch":WCSession.isSupported(),"notifications":true,"biometrics":true,"liveActivities":ActivityAuthorizationInfo().areActivitiesEnabled]
            case "healthAuthorize": try await HealthReader.authorize(); output = ["requested":true,"note":"Permission request finished. Apple does not expose which read permissions were denied."]
            case "healthRead": output = ["records":try await HealthReader.read(days:input["days"] as? Int ?? 1)]
            case "commands": output = ["commands":try encode(PulseStore.commands())]
            case "ack": PulseStore.acknowledge(input["ids"] as? [String] ?? [])
            case "publish": if let data = input["snapshot"] as? [String:Any] { let decoder=JSONDecoder(); decoder.dateDecodingStrategy = .secondsSince1970; let value = try decoder.decode(PulseSnapshot.self, from:JSONSerialization.data(withJSONObject:data)); guard value.waterMl >= 0, value.goalMl > 0, value.elapsed >= 0 else { throw BridgeError.invalid }; PulseStore.put(value); if WCSession.default.activationState == .activated { try? WCSession.default.updateApplicationContext(["snapshot":try encode(value)]) }; if value.waterMl >= value.goalMl { cancelToday() } }
            case "reminders": let approved = try await UNUserNotificationCenter.current().requestAuthorization(options:[.alert,.sound]); if approved { try await reminders(hours:input["hours"] as? [Int] ?? [9,12,15,18]) }; output = ["allowed":approved]
            case "biometric": let enabled = input["enabled"] as? Bool ?? false; let context = LAContext(); if enabled { let success = try await context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason:"Enable MacroPulse device-security lock"); if !success { throw BridgeError.invalid } }; UserDefaults.standard.set(enabled,forKey:"biometricLock"); output = ["enabled":enabled]
            case "activity": try await activity()
            default: throw BridgeError.invalid
            }; reply(id:id, result:output)
        } catch { reply(id:id,error:error.localizedDescription) } }
    }
    private func encode<T:Encodable>(_ value:T) throws -> Any { let encoder=JSONEncoder();encoder.dateEncodingStrategy = .secondsSince1970;return try JSONSerialization.jsonObject(with:encoder.encode(value)) }
    private func reply(id:String,result:[String:Any] = [:],error:String? = nil) { let payload:[String:Any] = ["id":id,"result":result,"error":error as Any? ?? NSNull()]; web?.callAsyncJavaScript("window.dispatchEvent(new CustomEvent('mp-native-result',{detail:payload}))",arguments:["payload":payload],in:nil,in:.page,completionHandler:nil) }
    private func cancelToday() { UNUserNotificationCenter.current().getPendingNotificationRequests { rows in UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers:rows.filter {$0.identifier.hasPrefix("water-"+PulseStore.today)}.map(\.identifier)) } }
    private func reminders(hours:[Int]) async throws { guard !hours.isEmpty, hours.count <= 8, hours.allSatisfy({(0...23).contains($0)}) else { throw BridgeError.invalid }; let center = UNUserNotificationCenter.current(); let pending = await center.pendingNotificationRequests(); center.removePendingNotificationRequests(withIdentifiers:pending.filter {$0.identifier.hasPrefix("water-")}.map(\.identifier)); for day in 0..<7 { if day == 0 && PulseStore.snapshot().date == PulseStore.today && PulseStore.snapshot().waterMl >= PulseStore.snapshot().goalMl { continue }; for hour in Set(hours) { let date = Calendar.current.date(byAdding:.day,value:day,to:Date())!, comps = Calendar.current.dateComponents([.year,.month,.day],from:date); var target = comps; target.hour=hour; target.minute=0; guard let fire=Calendar.current.date(from:target), fire>Date() else { continue }; let formatter=DateFormatter();formatter.dateFormat="yyyy-MM-dd";let id="water-"+formatter.string(from:fire)+"-\(hour)"; let content=UNMutableNotificationContent();content.title="Hydration check-in";content.body="Review your water goal in MacroPulse.";content.sound = .default;try await center.add(UNNotificationRequest(identifier:id,content:content,trigger:UNCalendarNotificationTrigger(dateMatching:target,repeats:false))) } } }
    private func activity() async throws { let s=PulseStore.snapshot(); let state=PulseActivity.ContentState(elapsed:s.elapsed,paused:s.paused,started:Date().addingTimeInterval(-Double(s.elapsed)),waterMl:Int(s.waterMl)); if !s.running { for a in Activity<PulseActivity>.activities { await a.end(nil,dismissalPolicy:.immediate) }; return }; guard ActivityAuthorizationInfo().areActivitiesEnabled else { throw BridgeError.invalid }; if let a=Activity<PulseActivity>.activities.first { await a.update(ActivityContent(state:state,staleDate:Date().addingTimeInterval(900))) } else { _=try Activity.request(attributes:PulseActivity(name:"MacroPulse workout"),content:ActivityContent(state:state,staleDate:Date().addingTimeInterval(900)),pushType:nil) } }
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction:WKNavigationAction, decisionHandler:@escaping(WKNavigationActionPolicy)->Void) { guard let url=navigationAction.request.url else { decisionHandler(.cancel);return }; if url.scheme=="https" && url.host=="joewalker989.github.io" && url.path.hasPrefix("/MacroPulse/") { decisionHandler(.allow) } else { if navigationAction.navigationType == .linkActivated { UIApplication.shared.open(url) }; decisionHandler(.cancel) } }
    nonisolated func session(_ session:WCSession,activationDidCompleteWith activationState:WCSessionActivationState,error:Error?) {}
    nonisolated func sessionDidBecomeInactive(_ session:WCSession) {}
    nonisolated func sessionDidDeactivate(_ session:WCSession) { session.activate() }
    nonisolated func session(_ session:WCSession,didReceiveUserInfo userInfo:[String:Any]) { Task { @MainActor in guard let action=userInfo["action"] as? String, ["water","pause","resume","stop"].contains(action),let id=userInfo["id"] as? String else { return }; PulseStore.enqueue(action,amount:userInfo["amount"] as? Double,id:id,date:userInfo["date"] as? String ?? PulseStore.today,targetSession:userInfo["targetSession"] as? String,at:Date(timeIntervalSince1970:userInfo["at"] as? Double ?? 0)) } }
    enum BridgeError: LocalizedError { case invalid; var errorDescription:String? { "Request is unavailable or invalid. Review native permissions and inputs." } }
}
