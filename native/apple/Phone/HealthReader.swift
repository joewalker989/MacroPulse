import Foundation
import HealthKit

enum HealthReader {
    static let store = HKHealthStore()
    static var types: Set<HKObjectType> { Set([HKObjectType.quantityType(forIdentifier: .bodyMass)!, HKObjectType.quantityType(forIdentifier: .stepCount)!, HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!, HKObjectType.quantityType(forIdentifier: .heartRate)!, HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!, HKObjectType.workoutType()]) }
    static func authorize() async throws { guard HKHealthStore.isHealthDataAvailable() else { throw ReaderError.unavailable }; try await store.requestAuthorization(toShare: [], read: types) }
    static func samples(_ type: HKSampleType, days: Int) async throws -> [HKSample] {
        let from = Calendar.current.date(byAdding: .day, value: -days, to: Date())!, predicate = HKQuery.predicateForSamples(withStart: from, end: Date(), options: .strictStartDate)
        return try await withCheckedThrowingContinuation { continuation in
            store.execute(HKSampleQuery(sampleType: type, predicate: predicate, limit: 3001, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { _, rows, error in
                if let error = error { continuation.resume(throwing: error) } else if (rows?.count ?? 0) > 3000 { continuation.resume(throwing: ReaderError.tooMany) } else { continuation.resume(returning: rows ?? []) }
            })
        }
    }
    static func read(days: Int) async throws -> [[String: Any]] {
        guard (1...7).contains(days) else { throw ReaderError.range }; var result: [[String: Any]] = []; let iso = ISO8601DateFormatter(); iso.timeZone = .current
        for type in types {
            guard let sampleType = type as? HKSampleType else { continue }
            for sample in try await samples(sampleType, days: days) {
                var kind = "", value: Double = 0, unit = ""
                if let q = sample as? HKQuantitySample {
                    switch q.quantityType.identifier {
                    case HKQuantityTypeIdentifier.bodyMass.rawValue: kind = "weight"; value = q.quantity.doubleValue(for: .pound()); unit = "lb"
                    case HKQuantityTypeIdentifier.stepCount.rawValue: kind = "steps"; value = q.quantity.doubleValue(for: .count()); unit = "count"
                    case HKQuantityTypeIdentifier.activeEnergyBurned.rawValue: kind = "activeEnergy"; value = q.quantity.doubleValue(for: .kilocalorie()); unit = "kcal"
                    case HKQuantityTypeIdentifier.heartRate.rawValue: kind = "heartRate"; value = q.quantity.doubleValue(for: HKUnit.count().unitDivided(by: .minute())); unit = "bpm"
                    default: continue
                    }
                } else if let sleep = sample as? HKCategorySample { if ![HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue, HKCategoryValueSleepAnalysis.asleepCore.rawValue, HKCategoryValueSleepAnalysis.asleepDeep.rawValue, HKCategoryValueSleepAnalysis.asleepREM.rawValue].contains(sleep.value) { continue }; kind = "sleep"; value = sleep.endDate.timeIntervalSince(sleep.startDate)/60; unit = "min"
                } else if let workout = sample as? HKWorkout { kind = "workout"; value = workout.duration/60; unit = "min" } else { continue }
                result.append(["type":kind,"source":sample.sourceRevision.source.name,"start":iso.string(from: sample.startDate),"end":iso.string(from: sample.endDate),"value":value,"unit":unit])
                if result.count > 3000 { throw ReaderError.tooMany }
            }
        }; return result
    }
    enum ReaderError: LocalizedError {
        case unavailable, tooMany, range
        var errorDescription: String? { switch self {case .unavailable: return "HealthKit is unavailable on this device."; case .tooMany: return "More than 3,000 observations. Choose a shorter window; nothing was silently truncated."; case .range: return "Choose 1–7 days."} }
    }
}
