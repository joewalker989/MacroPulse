import WidgetKit
import SwiftUI
import ActivityKit

struct PulseEntry: TimelineEntry { let date:Date; let snapshot:PulseSnapshot }
struct PulseProvider: TimelineProvider {
    func placeholder(in context:Context)->PulseEntry { PulseEntry(date:Date(),snapshot:PulseSnapshot()) }
    func getSnapshot(in context:Context,completion:@escaping(PulseEntry)->Void) { completion(PulseEntry(date:Date(),snapshot:PulseStore.snapshot())) }
    func getTimeline(in context:Context,completion:@escaping(Timeline<PulseEntry>)->Void) { completion(Timeline(entries:[PulseEntry(date:Date(),snapshot:PulseStore.snapshot())],policy:.after(Date().addingTimeInterval(900)))) }
}
struct PulseWidget: Widget {
    let kind="MacroPulseSummary"
    var body:some WidgetConfiguration { StaticConfiguration(kind:kind,provider:PulseProvider()) { entry in VStack(alignment:.leading) { Text("MacroPulse").font(.headline); Text("\(Int(entry.snapshot.waterMl)) / \(Int(entry.snapshot.goalMl)) ml"); ProgressView(value:min(entry.snapshot.waterMl/max(1,entry.snapshot.goalMl),1)); Text("\(Int(entry.snapshot.caloriesRemaining)) kcal remaining").font(.caption); Button(intent:AddWaterIntent()) { Label("¼ jug",systemImage:"drop.fill") } }.containerBackground(for:.widget) { Color.green.opacity(0.16) }.widgetURL(URL(string:"https://joewalker989.github.io/MacroPulse/#home")) }.configurationDisplayName("MacroPulse daily targets").description("Last shared phone snapshot; quarter-jug entries queue until the app confirms them.").supportedFamilies([.systemSmall,.systemMedium,.accessoryRectangular]) }
}
struct PulseLiveWidget: Widget {
    var body:some WidgetConfiguration { ActivityConfiguration(for:PulseActivity.self) { context in VStack { Text(context.attributes.name).font(.headline); if context.state.paused { Text(Duration.seconds(context.state.elapsed).formatted(.time(pattern:.hourMinuteSecond))) } else { Text(context.state.started,style:.timer).monospacedDigit() }; Text("\(context.state.waterMl) ml water") }.padding().activityBackgroundTint(.black).activitySystemActionForegroundColor(.green) } dynamicIsland: { context in DynamicIsland { DynamicIslandExpandedRegion(.leading) { Image(systemName:"figure.strengthtraining.traditional") }; DynamicIslandExpandedRegion(.trailing) { Text(context.state.paused ? "Paused":"Workout") }; DynamicIslandExpandedRegion(.bottom) { if context.state.paused { Text(Duration.seconds(context.state.elapsed).formatted(.time(pattern:.hourMinuteSecond))) } else { Text(context.state.started,style:.timer).monospacedDigit() } } } compactLeading: { Image(systemName:"figure.strengthtraining.traditional") } compactTrailing: { Text(context.state.paused ? "Ⅱ":"●").foregroundStyle(.green) } minimal: { Image(systemName:"figure.strengthtraining.traditional") } } }
}
@main struct PulseWidgets: WidgetBundle { var body:some Widget { PulseWidget(); PulseLiveWidget() } }
