import Foundation
import Darwin
import WidgetKit
import AppIntents
#if os(iOS)
import ActivityKit
#endif
import UserNotifications

struct PulseSnapshot: Codable {
    var waterMl: Double = 0
    var goalMl: Double = 2000
    var caloriesRemaining: Double = 0
    var elapsed: Int = 0
    var running: Bool = false
    var sessionID: String = ""
    var paused: Bool = false
    var date: String = ""
    var updatedAt: Date = Date()
}
struct PulseCommand: Codable { let id: String; let action: String; let amount: Double?; let date: String; let targetSession: String?; let at: Date? }
enum PulseStore {
    static let group = "group.com.joewalker989.macropulse"
    static var defaults: UserDefaults { UserDefaults(suiteName: group) ?? .standard }
    static var today: String { let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; return f.string(from: Date()) }
    static func snapshot() -> PulseSnapshot { guard let data = defaults.data(forKey: "snapshot"), let value = try? JSONDecoder().decode(PulseSnapshot.self, from: data) else { return PulseSnapshot() }; return value }
    static func put(_ snapshot: PulseSnapshot) { if let data = try? JSONEncoder().encode(snapshot) { defaults.set(data, forKey: "snapshot") }; WidgetCenter.shared.reloadAllTimelines() }
    static func queue<T>(_ change: (inout [PulseCommand])->T) -> T {
        let folder=FileManager.default.containerURL(forSecurityApplicationGroupIdentifier:group) ?? FileManager.default.urls(for:.documentDirectory,in:.userDomainMask)[0]
        try? FileManager.default.createDirectory(at:folder,withIntermediateDirectories:true)
        let fd=Darwin.open(folder.appendingPathComponent("commands.lock").path,O_CREAT|O_RDWR,S_IRUSR|S_IWUSR)
        if fd>=0 { flock(fd,LOCK_EX) }; defer { if fd>=0 { flock(fd,LOCK_UN);Darwin.close(fd) } }
        let file=folder.appendingPathComponent("commands.json");var rows=(try? JSONDecoder().decode([PulseCommand].self,from:Data(contentsOf:file))) ?? []
        let result=change(&rows);if let data=try? JSONEncoder().encode(rows) { try? data.write(to:file,options:[.atomic,.completeFileProtectionUntilFirstUserAuthentication]) };return result
    }
    static func commands() -> [PulseCommand] { queue { $0 } }
    static func enqueue(_ action: String, amount: Double? = nil, id: String = UUID().uuidString, date:String=today,targetSession:String?=nil,at:Date=Date()) {
        queue { rows in guard !rows.contains(where: {$0.id == id}), rows.count < 100 else { return };rows.append(PulseCommand(id:id,action:action,amount:amount,date:date,targetSession:targetSession,at:at)) }
    }
    static func acknowledge(_ ids: [String]) { queue { $0.removeAll { ids.contains($0.id) } } }
    static func addWater(_ ml: Double) {
        enqueue("water", amount: ml); var value = snapshot(); if value.date != today { value.date = today; value.waterMl = 0 }; value.waterMl += ml; value.updatedAt = Date(); put(value)
        if value.waterMl >= value.goalMl { UNUserNotificationCenter.current().getPendingNotificationRequests { requests in UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: requests.filter {$0.identifier.hasPrefix("water-" + today)}.map(\.identifier)) } }
    }
}
struct AddWaterIntent: AppIntent {
    static var title: LocalizedStringResource = "Log a quarter jug"
    static var description = IntentDescription("Queue 10 US fl oz for MacroPulse. The phone confirms it in the shared log when opened.")
    func perform() async throws -> some IntentResult { PulseStore.addWater(295.735295625); return .result() }
}
#if os(iOS)
struct PulseActivity: ActivityAttributes {
    struct ContentState: Codable, Hashable { var elapsed: Int; var paused: Bool; var started: Date; var waterMl: Int }
    var name: String
}
#endif
