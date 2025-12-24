import { useState } from 'react';
import { 
  LayoutDashboard, 
  List, 
  Map, 
  BarChart3, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  MapPin,
  Filter,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';

type TabType = 'dashboard' | 'issues' | 'map' | 'reports';

interface Reporter {
  name: string;
  email: string;
  reportedDate: string;
}

interface IssueData {
  id: string;
  image: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  urgencyScore: number;
  status: 'Issue Raised' | 'Authorities Contacted' | 'Issue Resolved';
  reportedDate: string;
  assignedTo?: string;
  reporters: Reporter[]; // Multiple reporters for duplicate issues
  aiAnalysis?: string;
}

const mockAdminIssues: IssueData[] = [
  {
    id: 'ISS-001',
    image: 'https://images.unsplash.com/photo-1765300013135-e047e42de2ea?w=200',
    category: 'Pothole',
    location: 'Golghar Road, Gorakhpur, Uttar Pradesh',
    latitude: 26.7606,
    longitude: 83.3732,
    urgency: 'High',
    urgencyScore: 85,
    status: 'Authorities Contacted',
    reportedDate: 'Dec 22, 2024',
    assignedTo: 'Team Alpha',
    reporters: [
      { name: 'Rajesh Kumar', email: 'rajesh@example.com', reportedDate: 'Dec 22, 2024' },
      { name: 'Priya Sharma', email: 'priya@example.com', reportedDate: 'Dec 22, 2024' },
      { name: 'Amit Patel', email: 'amit@example.com', reportedDate: 'Dec 23, 2024' },
    ],
    aiAnalysis: 'Large pothole detected, approximately 2 feet in diameter with 6+ inches depth',
  },
  {
    id: 'ISS-002',
    image: 'https://images.unsplash.com/photo-1580767114670-c778cc443675?w=200',
    category: 'Garbage Accumulation',
    location: 'Railway Station Road, Gorakhpur, Uttar Pradesh',
    latitude: 26.7588,
    longitude: 83.3697,
    urgency: 'Medium',
    urgencyScore: 55,
    status: 'Issue Raised',
    reportedDate: 'Dec 23, 2024',
    reporters: [
      { name: 'Sneha Reddy', email: 'sneha@example.com', reportedDate: 'Dec 23, 2024' },
      { name: 'Vikram Singh', email: 'vikram@example.com', reportedDate: 'Dec 23, 2024' },
    ],
    aiAnalysis: 'Overflowing bins detected with scattered litter across area',
  },
  {
    id: 'ISS-003',
    image: 'https://images.unsplash.com/photo-1685992830281-2eef1f9bd3e8?w=200',
    category: 'Broken Streetlight',
    location: 'University Road, BRD Medical College Area, Gorakhpur, UP',
    latitude: 26.7658,
    longitude: 83.3793,
    urgency: 'High',
    urgencyScore: 75,
    status: 'Issue Resolved',
    reportedDate: 'Dec 19, 2024',
    assignedTo: 'Team Beta',
    reporters: [
      { name: 'Anita Desai', email: 'anita@example.com', reportedDate: 'Dec 19, 2024' },
    ],
    aiAnalysis: 'Non-functional street lamp with broken fixture visible',
  },
  {
    id: 'ISS-004',
    image: 'https://images.unsplash.com/photo-1613894811137-b5ee44ba3cb3?w=200',
    category: 'Graffiti',
    location: 'Gorakhnath Temple Road, Gorakhpur, Uttar Pradesh',
    latitude: 26.7504,
    longitude: 83.3942,
    urgency: 'Low',
    urgencyScore: 35,
    status: 'Issue Raised',
    reportedDate: 'Dec 21, 2024',
    reporters: [
      { name: 'Rahul Verma', email: 'rahul@example.com', reportedDate: 'Dec 21, 2024' },
    ],
    aiAnalysis: 'Vandalism on public property wall with multiple spray paint markings',
  },
  {
    id: 'ISS-005',
    image: 'https://images.unsplash.com/photo-1759803612770-0330d9081176?w=200',
    category: 'Damaged Road',
    location: 'Kushinagar Highway (NH-28), Near Gorakhpur, UP',
    latitude: 26.7779,
    longitude: 83.4321,
    urgency: 'Critical',
    urgencyScore: 92,
    status: 'Authorities Contacted',
    reportedDate: 'Dec 20, 2024',
    assignedTo: 'Team Alpha',
    reporters: [
      { name: 'Deepak Joshi', email: 'deepak@example.com', reportedDate: 'Dec 20, 2024' },
      { name: 'Kavita Nair', email: 'kavita@example.com', reportedDate: 'Dec 20, 2024' },
      { name: 'Suresh Iyer', email: 'suresh@example.com', reportedDate: 'Dec 21, 2024' },
      { name: 'Meera Kapoor', email: 'meera@example.com', reportedDate: 'Dec 21, 2024' },
    ],
    aiAnalysis: 'Deep road damage with multiple cracks and exposed infrastructure hazard',
  },
  {
    id: 'ISS-006',
    image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=200',
    category: 'Blocked Drainage',
    location: 'Bank Road, Civil Lines, Gorakhpur, Uttar Pradesh',
    latitude: 26.7528,
    longitude: 83.3788,
    urgency: 'High',
    urgencyScore: 78,
    status: 'Issue Raised',
    reportedDate: 'Dec 24, 2024',
    reporters: [
      { name: 'Pooja Gupta', email: 'pooja@example.com', reportedDate: 'Dec 24, 2024' },
      { name: 'Arjun Mehta', email: 'arjun@example.com', reportedDate: 'Dec 24, 2024' },
    ],
    aiAnalysis: 'Drainage blockage causing water accumulation in high-traffic area',
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);

  const areas = ['All', 'Golghar Road', 'Railway Station Road', 'University Road', 'Bank Road', 'Gorakhpur', 'Kushinagar'];

  const filteredIssues = mockAdminIssues.filter(issue => {
    const matchesUrgency = urgencyFilter === 'All' || issue.urgency === urgencyFilter;
    const matchesArea = selectedArea === 'All' || issue.location.includes(selectedArea);
    return matchesUrgency && matchesArea;
  });

  const stats = {
    total: mockAdminIssues.length,
    pending: mockAdminIssues.filter(i => i.status === 'Issue Raised').length,
    inProgress: mockAdminIssues.filter(i => i.status === 'Authorities Contacted').length,
    resolved: mockAdminIssues.filter(i => i.status === 'Issue Resolved').length,
    critical: mockAdminIssues.filter(i => i.urgency === 'Critical').length,
    high: mockAdminIssues.filter(i => i.urgency === 'High').length,
    duplicates: mockAdminIssues.filter(i => i.reporters.length > 1).length,
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-200 text-red-900 border-red-300';
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issue Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Authorities Contacted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Issue Raised':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-700';
    if (score >= 65) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Issues</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <List className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical/High</p>
              <p className="text-3xl mt-1">{stats.critical + stats.high}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Multi-Reporter</p>
              <p className="text-3xl mt-1">{stats.duplicates}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Critical Issues */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          High Priority Issues Requiring Immediate Attention
        </h3>
        <div className="space-y-3">
          {mockAdminIssues
            .filter(issue => issue.urgency === 'Critical' || issue.urgency === 'High')
            .sort((a, b) => b.urgencyScore - a.urgencyScore)
            .slice(0, 5)
            .map(issue => (
              <div key={issue.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <img src={issue.image} alt={issue.category} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{issue.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(issue.urgency)}`}>
                      {issue.urgency}
                    </span>
                    {issue.reporters.length > 1 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {issue.reporters.length} reporters
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {issue.location}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className={`flex items-center gap-1 ${getUrgencyScoreColor(issue.urgencyScore)}`}>
                      <Zap className="w-3 h-3" />
                      Urgency Score: {issue.urgencyScore}/100
                    </span>
                    <span>{issue.reportedDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderIssues = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Filter by Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Filter by Urgency</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Urgencies</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm text-gray-600">Issue</th>
              <th className="text-left p-4 text-sm text-gray-600">Location</th>
              <th className="text-left p-4 text-sm text-gray-600">Urgency</th>
              <th className="text-left p-4 text-sm text-gray-600">Status</th>
              <th className="text-left p-4 text-sm text-gray-600">Reports</th>
              <th className="text-left p-4 text-sm text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={issue.image} alt={issue.category} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm">{issue.category}</p>
                      <p className="text-xs text-gray-500">{issue.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-700">{issue.location}</p>
                  <p className="text-xs text-gray-500">{issue.reportedDate}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full border w-fit ${getUrgencyColor(issue.urgency)}`}>
                      {issue.urgency}
                    </span>
                    <span className={`text-xs ${getUrgencyScoreColor(issue.urgencyScore)}`}>
                      Score: {issue.urgencyScore}/100
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{issue.reporters.length}</span>
                    {issue.reporters.length > 1 && (
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'issues':
        return renderIssues();
      case 'map':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Map View</h3>
            <p className="text-sm text-gray-500">Geographic visualization of all reported issues coming soon</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Analytics & Reports</h3>
            <p className="text-sm text-gray-500">Detailed analytics and reporting features coming soon</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage civic issues across all areas</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 border border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'issues'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
            All Issues
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Map className="w-4 h-4" />
            Map View
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </button>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Issue Detail Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="mb-1">{selectedIssue.category}</h2>
                    <p className="text-sm text-gray-500">{selectedIssue.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <img
                  src={selectedIssue.image}
                  alt={selectedIssue.category}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <div className="space-y-4">
                  {/* Urgency and Score */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      AI Urgency Analysis
                    </h3>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Urgency Level</p>
                        <span className={`text-sm px-3 py-1 rounded-full border ${getUrgencyColor(selectedIssue.urgency)}`}>
                          {selectedIssue.urgency}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Urgency Score</p>
                        <p className={`text-2xl ${getUrgencyScoreColor(selectedIssue.urgencyScore)}`}>
                          {selectedIssue.urgencyScore}/100
                        </p>
                      </div>
                    </div>
                    {selectedIssue.aiAnalysis && (
                      <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-blue-200">
                        {selectedIssue.aiAnalysis}
                      </p>
                    )}
                  </div>

                  {/* Multiple Reporters */}
                  {selectedIssue.reporters.length > 1 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-sm mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        Flagged by {selectedIssue.reporters.length} Citizens
                      </h3>
                      <div className="space-y-2">
                        {selectedIssue.reporters.map((reporter, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="text-gray-900">{reporter.name}</p>
                              <p className="text-xs text-gray-500">{reporter.email}</p>
                            </div>
                            <span className="text-xs text-gray-500">{reporter.reportedDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {selectedIssue.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Reported Date</p>
                      <p className="text-gray-900">{selectedIssue.reportedDate}</p>
                    </div>
                  </div>

                  {selectedIssue.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                      <p className="text-gray-900">{selectedIssue.assignedTo}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <select className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Issue Raised">Issue Raised</option>
                      <option value="Authorities Contacted">Authorities Contacted</option>
                      <option value="Issue Resolved">Issue Resolved</option>
                    </select>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}