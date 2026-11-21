import Complaint from "../models/Complaint.js";

export async function getDashboardStats() {
  const [total, statuses, priorities, categories, areas, recent, resolved, highPriorityUnresolved] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Complaint.aggregate([
      { $match: { locationName: { $type: "string", $ne: "" } } },
      { $group: { _id: "$locationName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]),
    Complaint.find().sort({ createdAt: -1 }).limit(8).lean(),
    Complaint.find({ status: "RESOLVED", resolvedAt: { $ne: null } }, { createdAt: 1, resolvedAt: 1 }).lean(),
    Complaint.countDocuments({ priority: "HIGH", status: { $nin: ["RESOLVED", "REJECTED"] } })
  ]);
  const statusCounts = Object.fromEntries(statuses.map((item) => [item._id, item.count]));
  const priorityCounts = Object.fromEntries(priorities.map((item) => [item._id, item.count]));
  const resolutionTimes = resolved.map((item) => item.resolvedAt - item.createdAt).filter((duration) => duration >= 0);
  return {
    total,
    pending: (statusCounts.SUBMITTED || 0) + (statusCounts.UNDER_REVIEW || 0),
    inProgress: statusCounts.IN_PROGRESS || 0,
    resolved: statusCounts.RESOLVED || 0,
    highSeverity: priorityCounts.HIGH || 0,
    highPriorityUnresolved,
    resolutionRate: total ? Math.round(((statusCounts.RESOLVED || 0) / total) * 100) : 0,
    averageResolutionHours: resolutionTimes.length
      ? Math.round(resolutionTimes.reduce((sum, duration) => sum + duration, 0) / resolutionTimes.length / 3600000 * 10) / 10
      : null,
    categoryDistribution: categories.map((item) => ({ name: item._id, value: item.count })),
    areaDistribution: areas.map((item) => ({ name: item._id, value: item.count })),
    severityDistribution: ["HIGH", "MEDIUM", "LOW"].map((name) => ({ name, value: priorityCounts[name] || 0 })),
    recent
  };
}
