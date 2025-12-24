// Urgency Calculator for Civic Issues
// Uses AI-like logic to determine urgency based on issue type, location, and time

export interface UrgencyFactors {
  issueType: string;
  location: string;
  description?: string;
  imageAnalysis?: string;
  timeOfDay?: string;
  weatherCondition?: string;
}

export interface UrgencyResult {
  score: number; // 0-100
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: {
    name: string;
    impact: number;
    reason: string;
  }[];
  recommendation: string;
  estimatedResponseTime: string;
}

const ISSUE_TYPE_URGENCY: Record<string, number> = {
  // Critical infrastructure
  'Gas Leak': 95,
  'Water Main Break': 90,
  'Electrical Hazard': 90,
  'Fire Hazard': 95,
  'Downed Power Line': 95,
  
  // High priority
  'Pothole': 70,
  'Broken Streetlight': 65,
  'Traffic Signal Malfunction': 85,
  'Blocked Drainage': 75,
  'Damaged Road': 70,
  'Missing Manhole Cover': 85,
  
  // Medium priority
  'Garbage Accumulation': 50,
  'Illegal Dumping': 55,
  'Graffiti': 40,
  'Overgrown Vegetation': 35,
  'Sidewalk Damage': 60,
  'Street Sign Damage': 55,
  
  // Lower priority
  'Noise Complaint': 30,
  'Stray Animals': 45,
  'Public Property Damage': 50,
  'Park Maintenance': 35,
  'Faded Road Markings': 40,
};

// High traffic and sensitive areas in Uttar Pradesh (esp. Lucknow)
const HIGH_TRAFFIC_AREAS = [
  'hazratganj', 'gomti nagar', 'alambagh', 'charbagh', 'indira nagar',
  'aminabad', 'mahanagar', 'aliganj', 'rajajipuram', 'station',
  'hospital', 'school', 'college', 'market', 'railway', 'expressway',
  'vidhan sabha', 'secretariat', 'bus stand', 'chowk', 'crossing',
  'university', 'mall', 'park', 'gate', 'temple', 'mosque', 'church'
];

export function calculateUrgency(factors: UrgencyFactors): UrgencyResult {
  const urgencyFactors: { name: string; impact: number; reason: string }[] = [];
  let totalScore = 0;
  
  // 1. Base urgency from issue type (40% weight)
  const baseUrgency = ISSUE_TYPE_URGENCY[factors.issueType] || 50;
  urgencyFactors.push({
    name: 'Issue Type',
    impact: baseUrgency * 0.4,
    reason: `${factors.issueType} has a base urgency rating of ${baseUrgency}/100`
  });
  totalScore += baseUrgency * 0.4;
  
  // 2. Location impact (25% weight)
  const locationLower = factors.location.toLowerCase();
  const isHighTrafficArea = HIGH_TRAFFIC_AREAS.some(area => 
    locationLower.includes(area)
  );
  
  const locationImpact = isHighTrafficArea ? 25 : 12.5;
  urgencyFactors.push({
    name: 'Location Impact',
    impact: locationImpact,
    reason: isHighTrafficArea 
      ? 'High traffic area - affects many people'
      : 'Moderate traffic area'
  });
  totalScore += locationImpact;
  
  // 3. Safety hazard detection (25% weight)
  const safetyKeywords = [
    'dangerous', 'hazard', 'broken', 'exposed', 'leak', 
    'fire', 'electrical', 'sharp', 'deep', 'missing'
  ];
  
  const descriptionLower = (factors.description || '').toLowerCase();
  const imageAnalysisLower = (factors.imageAnalysis || '').toLowerCase();
  const combinedText = descriptionLower + ' ' + imageAnalysisLower;
  
  const safetyCount = safetyKeywords.filter(keyword => 
    combinedText.includes(keyword)
  ).length;
  
  const safetyImpact = Math.min(safetyCount * 5, 25);
  if (safetyImpact > 0) {
    urgencyFactors.push({
      name: 'Safety Concern',
      impact: safetyImpact,
      reason: `Detected ${safetyCount} safety-related indicator(s)`
    });
    totalScore += safetyImpact;
  }
  
  // 4. Time sensitivity (10% weight)
  const currentHour = new Date().getHours();
  const isPeakHours = (currentHour >= 7 && currentHour <= 10) || 
                      (currentHour >= 16 && currentHour <= 19);
  
  const timeImpact = isPeakHours ? 10 : 5;
  urgencyFactors.push({
    name: 'Time Factor',
    impact: timeImpact,
    reason: isPeakHours 
      ? 'Reported during peak hours - higher impact'
      : 'Reported during off-peak hours'
  });
  totalScore += timeImpact;
  
  // Calculate final score (0-100)
  const finalScore = Math.min(Math.round(totalScore), 100);
  
  // Determine urgency level
  let level: 'Low' | 'Medium' | 'High' | 'Critical';
  let recommendation: string;
  let estimatedResponseTime: string;
  
  if (finalScore >= 85) {
    level = 'Critical';
    recommendation = 'Immediate action required. Deploy emergency response team.';
    estimatedResponseTime = '1-2 hours';
  } else if (finalScore >= 65) {
    level = 'High';
    recommendation = 'High priority. Schedule response within same day.';
    estimatedResponseTime = '4-8 hours';
  } else if (finalScore >= 40) {
    level = 'Medium';
    recommendation = 'Moderate priority. Schedule within 2-3 days.';
    estimatedResponseTime = '2-3 days';
  } else {
    level = 'Low';
    recommendation = 'Lower priority. Can be scheduled during routine maintenance.';
    estimatedResponseTime = '5-7 days';
  }
  
  return {
    score: finalScore,
    level,
    factors: urgencyFactors,
    recommendation,
    estimatedResponseTime
  };
}

// Mock AI image analysis (in real app, would call vision API)
export function analyzeIssueImage(imageUrl: string, issueType: string): string {
  const analyses: Record<string, string[]> = {
    'Pothole': [
      'Large pothole detected, approximately 2 feet in diameter',
      'Deep road damage visible, appears to be 6+ inches deep',
      'Multiple cracks radiating from center point'
    ],
    'Garbage Accumulation': [
      'Large pile of mixed waste visible',
      'Overflowing bins detected',
      'Scattered litter across area'
    ],
    'Broken Streetlight': [
      'Non-functional street lamp identified',
      'Broken fixture visible at top of pole',
      'Dark area indicating no illumination'
    ],
    'Graffiti': [
      'Vandalism on public property wall',
      'Multiple spray paint markings detected',
      'Fresh paint appearance suggests recent activity'
    ]
  };
  
  const options = analyses[issueType] || ['Issue visible in uploaded image'];
  return options[Math.floor(Math.random() * options.length)];
}