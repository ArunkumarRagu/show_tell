import type { Team, User, Activity, ActivityLog, AdminLog } from '@/types';

export const teams: Team[] = [
  { id: 't1', name: 'Phoenix', color: '#7C3AED', score: 4820, activitiesCompleted: 38, rank: 1, status: 'active', description: 'Rise from the ashes, every time.' },
  { id: 't2', name: 'Titans', color: '#06B6D4', score: 4350, activitiesCompleted: 35, rank: 2, status: 'active', description: 'Strength in every member.' },
  { id: 't3', name: 'Falcon', color: '#F59E0B', score: 3980, activitiesCompleted: 31, rank: 3, status: 'active', description: 'Swift, sharp, and precise.' },
  { id: 't4', name: 'Orion', color: '#10B981', score: 3420, activitiesCompleted: 28, rank: 4, status: 'active', description: 'Navigating the stars of innovation.' },
  { id: 't5', name: 'Vortex', color: '#F43F5E', score: 2950, activitiesCompleted: 24, rank: 5, status: 'active', description: 'Spin the challenge, own the result.' },
  { id: 't6', name: 'Nexus', color: '#3B82F6', score: 2480, activitiesCompleted: 20, rank: 6, status: 'active', description: 'Where every connection counts.' },
];

const avatarColors = ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#F43F5E', '#3B82F6'];


export const users: User[] = [
  { id: 'u1', name: 'Alex Carter', employeeId: 'EMP001', email: 'alex.carter@hat.co', teamId: 't1', teamName: 'Phoenix', score: 1240, rank: 1, status: 'active', role: 'user', activitiesCompleted: 12, avatarColor: avatarColors[0], joinedDate: '2025-01-15', lastActive: '2026-08-14 09:42' },
  { id: 'u2', name: 'Maya Singh', employeeId: 'EMP002', email: 'maya.singh@hat.co', teamId: 't1', teamName: 'Phoenix', score: 1180, rank: 2, status: 'active', role: 'user', activitiesCompleted: 11, avatarColor: avatarColors[1], joinedDate: '2025-01-20', lastActive: '2026-08-14 08:15' },
  { id: 'u3', name: 'Jordan Lee', employeeId: 'EMP003', email: 'jordan.lee@hat.co', teamId: 't1', teamName: 'Phoenix', score: 1100, rank: 4, status: 'active', role: 'user', activitiesCompleted: 10, avatarColor: avatarColors[2], joinedDate: '2025-02-01', lastActive: '2026-08-13 17:30' },
  { id: 'u4', name: 'Sam Rivera', employeeId: 'EMP004', email: 'sam.rivera@hat.co', teamId: 't1', teamName: 'Phoenix', score: 1300, rank: 3, status: 'active', role: 'user', activitiesCompleted: 13, avatarColor: avatarColors[3], joinedDate: '2025-01-10', lastActive: '2026-08-14 10:05' },
  { id: 'u5', name: 'Riley Chen', employeeId: 'EMP005', email: 'riley.chen@hat.co', teamId: 't2', teamName: 'Titans', score: 1150, rank: 5, status: 'active', role: 'user', activitiesCompleted: 11, avatarColor: avatarColors[4], joinedDate: '2025-01-18', lastActive: '2026-08-14 09:00' },
  { id: 'u6', name: 'Casey Park', employeeId: 'EMP006', email: 'casey.park@hat.co', teamId: 't2', teamName: 'Titans', score: 1080, rank: 6, status: 'active', role: 'user', activitiesCompleted: 10, avatarColor: avatarColors[5], joinedDate: '2025-02-05', lastActive: '2026-08-13 16:45' },
  { id: 'u7', name: 'Morgan Diaz', employeeId: 'EMP007', email: 'morgan.diaz@hat.co', teamId: 't2', teamName: 'Titans', score: 1020, rank: 8, status: 'active', role: 'user', activitiesCompleted: 9, avatarColor: avatarColors[0], joinedDate: '2025-02-10', lastActive: '2026-08-14 07:20' },
  { id: 'u8', name: 'Taylor Brooks', employeeId: 'EMP008', email: 'taylor.brooks@hat.co', teamId: 't2', teamName: 'Titans', score: 1100, rank: 7, status: 'active', role: 'user', activitiesCompleted: 10, avatarColor: avatarColors[1], joinedDate: '2025-01-25', lastActive: '2026-08-12 14:10' },
  { id: 'u9', name: 'Jamie Fox', employeeId: 'EMP009', email: 'jamie.fox@hat.co', teamId: 't3', teamName: 'Falcon', score: 980, rank: 9, status: 'active', role: 'user', activitiesCompleted: 9, avatarColor: avatarColors[2], joinedDate: '2025-02-15', lastActive: '2026-08-14 08:50' },
  { id: 'u10', name: 'Drew Patel', employeeId: 'EMP010', email: 'drew.patel@hat.co', teamId: 't3', teamName: 'Falcon', score: 950, rank: 10, status: 'active', role: 'user', activitiesCompleted: 8, avatarColor: avatarColors[3], joinedDate: '2025-03-01', lastActive: '2026-08-13 11:30' },
  { id: 'u11', name: 'Reese Walsh', employeeId: 'EMP011', email: 'reese.walsh@hat.co', teamId: 't3', teamName: 'Falcon', score: 880, rank: 12, status: 'active', role: 'user', activitiesCompleted: 8, avatarColor: avatarColors[4], joinedDate: '2025-03-05', lastActive: '2026-08-11 15:00' },
  { id: 'u12', name: 'Quinn Adams', employeeId: 'EMP012', email: 'quinn.adams@hat.co', teamId: 't3', teamName: 'Falcon', score: 920, rank: 11, status: 'active', role: 'user', activitiesCompleted: 8, avatarColor: avatarColors[5], joinedDate: '2025-02-20', lastActive: '2026-08-14 06:40' },
  { id: 'u13', name: 'Avery Stone', employeeId: 'EMP013', email: 'avery.stone@hat.co', teamId: 't4', teamName: 'Orion', score: 850, rank: 13, status: 'active', role: 'user', activitiesCompleted: 7, avatarColor: avatarColors[0], joinedDate: '2025-03-10', lastActive: '2026-08-13 09:15' },
  { id: 'u14', name: 'Blake Howard', employeeId: 'EMP014', email: 'blake.howard@hat.co', teamId: 't4', teamName: 'Orion', score: 820, rank: 14, status: 'active', role: 'user', activitiesCompleted: 7, avatarColor: avatarColors[1], joinedDate: '2025-03-15', lastActive: '2026-08-12 13:50' },
  { id: 'u15', name: 'Sage Kim', employeeId: 'EMP015', email: 'sage.kim@hat.co', teamId: 't4', teamName: 'Orion', score: 780, rank: 15, status: 'active', role: 'user', activitiesCompleted: 7, avatarColor: avatarColors[2], joinedDate: '2025-03-20', lastActive: '2026-08-14 10:10' },
  { id: 'u16', name: 'Dakota Reed', employeeId: 'EMP016', email: 'dakota.reed@hat.co', teamId: 't4', teamName: 'Orion', score: 970, rank: 10, status: 'active', role: 'user', activitiesCompleted: 9, avatarColor: avatarColors[3], joinedDate: '2025-02-28', lastActive: '2026-08-13 18:20' },
  { id: 'u17', name: 'Ellis Wong', employeeId: 'EMP017', email: 'ellis.wong@hat.co', teamId: 't5', teamName: 'Vortex', score: 720, rank: 17, status: 'active', role: 'user', activitiesCompleted: 6, avatarColor: avatarColors[4], joinedDate: '2025-04-01', lastActive: '2026-08-11 10:30' },
  { id: 'u18', name: 'Frankie Cole', employeeId: 'EMP018', email: 'frankie.cole@hat.co', teamId: 't5', teamName: 'Vortex', score: 680, rank: 18, status: 'active', role: 'user', activitiesCompleted: 6, avatarColor: avatarColors[5], joinedDate: '2025-04-05', lastActive: '2026-08-14 07:45' },
  { id: 'u19', name: 'Gerry Bell', employeeId: 'EMP019', email: 'gerry.bell@hat.co', teamId: 't5', teamName: 'Vortex', score: 640, rank: 19, status: 'active', role: 'user', activitiesCompleted: 6, avatarColor: avatarColors[0], joinedDate: '2025-04-10', lastActive: '2026-08-10 16:00' },
  { id: 'u20', name: 'Harper Nash', employeeId: 'EMP020', email: 'harper.nash@hat.co', teamId: 't5', teamName: 'Vortex', score: 910, rank: 12, status: 'active', role: 'user', activitiesCompleted: 8, avatarColor: avatarColors[1], joinedDate: '2025-03-25', lastActive: '2026-08-13 12:15' },
  { id: 'u21', name: 'Indigo Ray', employeeId: 'EMP021', email: 'indigo.ray@hat.co', teamId: 't6', teamName: 'Nexus', score: 600, rank: 20, status: 'active', role: 'user', activitiesCompleted: 5, avatarColor: avatarColors[2], joinedDate: '2025-04-15', lastActive: '2026-08-09 14:20' },
  { id: 'u22', name: 'Jules Park', employeeId: 'EMP022', email: 'jules.park@hat.co', teamId: 't6', teamName: 'Nexus', score: 560, rank: 21, status: 'active', role: 'user', activitiesCompleted: 5, avatarColor: avatarColors[3], joinedDate: '2025-04-20', lastActive: '2026-08-12 09:50' },
  { id: 'u23', name: 'Kai Morton', employeeId: 'EMP023', email: 'kai.morton@hat.co', teamId: 't6', teamName: 'Nexus', score: 520, rank: 22, status: 'inactive', role: 'user', activitiesCompleted: 5, avatarColor: avatarColors[4], joinedDate: '2025-04-25', lastActive: '2026-08-01 11:00' },
  { id: 'u24', name: 'Lane Bishop', employeeId: 'EMP024', email: 'lane.bishop@hat.co', teamId: 't6', teamName: 'Nexus', score: 800, rank: 16, status: 'active', role: 'user', activitiesCompleted: 7, avatarColor: avatarColors[5], joinedDate: '2025-03-30', lastActive: '2026-08-13 19:30' },
  { id: 'admin1', name: 'Admin Root', employeeId: 'ADM001', email: 'admin@hat.co', teamId: 't1', teamName: 'Phoenix', score: 0, rank: 0, status: 'active', role: 'admin', activitiesCompleted: 0, avatarColor: '#0f172a', joinedDate: '2025-01-01', lastActive: '2026-08-14 10:30' },
];

export const currentUser: User = users[0];

export const activities: Activity[] = [
  {
    id: 'a1', name: 'Code Review Sprint', description: 'Review a pull request, identify bugs, and suggest improvements under time pressure.', instructions: 'You will be shown 3 code snippets. For each, identify the bug and select the correct fix from the options. Work quickly — partial credit for near-misses.', difficulty: 'Easy', timeLimit: 300, maxScore: 100, passingScore: 60, status: 'active', category: 'Engineering', activityType: 'individual', completions: 142, avgScore: 78,
    questions: [
      { id: 'q1', prompt: 'What is the output of: `console.log(typeof null)`?', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correctIndex: 1 },
      { id: 'q2', prompt: 'Which method removes the last element of an array?', options: ['shift()', 'pop()', 'remove()', 'delete()'], correctIndex: 1 },
      { id: 'q3', prompt: 'What does `===` check that `==` does not?', options: ['Value only', 'Type only', 'Both type and value', 'Reference'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2', name: 'System Design Challenge', description: 'Design a scalable URL shortener architecture from scratch with constraints.', instructions: 'Answer 3 multiple-choice questions about system design trade-offs. Consider scale, latency, and consistency.', difficulty: 'Hard', timeLimit: 600, maxScore: 300, passingScore: 180, status: 'active', category: 'Architecture', activityType: 'group', completions: 64, avgScore: 195,
    questions: [
      { id: 'q1', prompt: 'For a URL shortener at 100M requests/day, which database is most appropriate for the redirect path?', options: ['PostgreSQL with indexes', 'Redis/Memcached cache layer', 'MongoDB', 'SQLite'], correctIndex: 1 },
      { id: 'q2', prompt: 'What is the primary trade-off of using base62 encoding for short URLs?', options: ['Longer URLs', 'Collision risk increases', 'No trade-off', 'Slower lookups'], correctIndex: 1 },
      { id: 'q3', prompt: 'Which approach best handles hot URLs under viral load?', options: ['Database replication', 'Edge caching with TTL', 'Client-side caching only', 'Sharding by hash'], correctIndex: 1 },
    ],
  },
  {
    id: 'a3', name: 'Bug Hunt: Race Condition', description: 'Find and fix a subtle race condition in concurrent code.', instructions: 'Analyze the described scenario and select the best fix for each question. Think about thread safety and synchronization.', difficulty: 'Medium', timeLimit: 420, maxScore: 200, passingScore: 120, status: 'active', category: 'Debugging', activityType: 'individual', completions: 98, avgScore: 142,
    questions: [
      { id: 'q1', prompt: 'A shared counter is incremented by 10 threads. Results are inconsistent. What is the most likely cause?', options: ['Integer overflow', 'Race condition on read-modify-write', 'Memory leak', 'Wrong data type'], correctIndex: 1 },
      { id: 'q2', prompt: 'Which synchronization primitive is most appropriate for a simple counter?', options: ['Semaphore', 'Mutex/lock', 'Condition variable', 'Spinlock only'], correctIndex: 1 },
      { id: 'q3', prompt: 'What is a disadvantage of coarse-grained locking?', options: ['Too complex', 'Reduced parallelism', 'Memory overhead', 'No disadvantage'], correctIndex: 1 },
    ],
  },
  {
    id: 'a4', name: 'API Design Quiz', description: 'Test your knowledge of RESTful API design principles and best practices.', instructions: 'Answer questions about HTTP methods, status codes, and API conventions. Choose the most correct answer.', difficulty: 'Easy', timeLimit: 240, maxScore: 100, passingScore: 60, status: 'active', category: 'API Design', activityType: 'individual', completions: 156, avgScore: 82,
    questions: [
      { id: 'q1', prompt: 'Which HTTP method is idempotent?', options: ['POST', 'PATCH', 'PUT', 'CONNECT'], correctIndex: 2 },
      { id: 'q2', prompt: 'What status code indicates a successful resource creation?', options: ['200', '201', '202', '204'], correctIndex: 1 },
      { id: 'q3', prompt: 'Which is NOT a REST constraint?', options: ['Statelessness', 'Client-server', 'SOAP messaging', 'Layered system'], correctIndex: 2 },
    ],
  },
  {
    id: 'a5', name: 'Database Optimization', description: 'Optimize slow queries and design efficient indexes for a growing dataset.', instructions: 'Read the scenario and choose the best optimization strategy. Consider query plans and index types.', difficulty: 'Hard', timeLimit: 600, maxScore: 300, passingScore: 180, status: 'active', category: 'Database', activityType: 'group', completions: 52, avgScore: 210,
    questions: [
      { id: 'q1', prompt: 'A query on a 10M row table takes 8 seconds. The WHERE clause filters on a non-indexed column. Best first step?', options: ['Add more RAM', 'Add a B-tree index on the column', 'Rewrite in NoSQL', 'Partition the table'], correctIndex: 1 },
      { id: 'q2', prompt: 'What is the main benefit of a covering index?', options: ['Smaller storage', 'Index-only scans avoid table lookups', 'Faster writes', 'Better compression'], correctIndex: 1 },
      { id: 'q3', prompt: 'When should you avoid adding an index?', options: ['On a primary key', 'On a write-heavy table with low read frequency', 'On a foreign key', 'On a column used in ORDER BY'], correctIndex: 1 },
    ],
  },
  {
    id: 'a6', name: 'Security Essentials', description: 'Identify common security vulnerabilities and their mitigations.', instructions: 'Read each scenario and select the correct vulnerability or mitigation. Think like both attacker and defender.', difficulty: 'Medium', timeLimit: 360, maxScore: 200, passingScore: 120, status: 'active', category: 'Security', activityType: 'individual', completions: 110, avgScore: 155,
    questions: [
      { id: 'q1', prompt: 'A login form accepts raw SQL in the username field. What vulnerability is this?', options: ['XSS', 'SQL Injection', 'CSRF', 'SSRF'], correctIndex: 1 },
      { id: 'q2', prompt: 'Which mitigation best prevents XSS in user-generated content?', options: ['Input validation + output encoding', 'Using HTTPS only', 'Rate limiting', 'IP allowlisting'], correctIndex: 0 },
      { id: 'q3', prompt: 'What does a Content Security Policy (CSP) primarily mitigate?', options: ['SQL Injection', 'XSS', 'DDoS', 'Brute force'], correctIndex: 1 },
    ],
  },
  {
    id: 'a7', name: 'Agile Ceremonies', description: 'Test your understanding of Scrum, Kanban, and Agile practices.', instructions: 'Answer questions about Agile frameworks, ceremonies, and roles. Pick the most accurate option.', difficulty: 'Easy', timeLimit: 180, maxScore: 100, passingScore: 60, status: 'active', category: 'Process', activityType: 'individual', completions: 134, avgScore: 85,
    questions: [
      { id: 'q1', prompt: 'Who is responsible for prioritizing the product backlog?', options: ['Scrum Master', 'Product Owner', 'Dev Team', 'Stakeholders'], correctIndex: 1 },
      { id: 'q2', prompt: 'What is the time-box for a Daily Scrum?', options: ['30 minutes', '15 minutes', '1 hour', 'No limit'], correctIndex: 1 },
      { id: 'q3', prompt: 'Which is NOT a Kanban principle?', options: ['Visualize workflow', 'Limit WIP', 'Sprint retrospectives', 'Manage flow'], correctIndex: 2 },
    ],
  },
  {
    id: 'a8', name: 'Cloud Architecture', description: 'Design resilient cloud infrastructure with proper service isolation.', instructions: 'Choose the best cloud architecture pattern for each scenario. Consider cost, reliability, and scale.', difficulty: 'Hard', timeLimit: 540, maxScore: 300, passingScore: 180, status: 'active', category: 'Cloud', activityType: 'group', completions: 48, avgScore: 220,
    questions: [
      { id: 'q1', prompt: 'For zero-downtime deployments with gradual traffic shifting, which strategy is best?', options: ['Recreate', 'Blue-green', 'Canary', 'Rolling without health checks'], correctIndex: 2 },
      { id: 'q2', prompt: 'What is the primary purpose of a circuit breaker pattern?', options: ['Load balancing', 'Prevent cascading failures', 'Encrypt traffic', 'Cache responses'], correctIndex: 1 },
      { id: 'q3', prompt: 'Which AWS service provides auto-scaling for containers?', options: ['ECS with Fargate', 'S3', 'RDS', 'CloudFront'], correctIndex: 0 },
    ],
  },
  {
    id: 'a9', name: 'Git Mastery', description: 'Demonstrate advanced Git workflows and conflict resolution skills.', instructions: 'Answer questions about Git internals and workflows. Consider both local and remote scenarios.', difficulty: 'Medium', timeLimit: 300, maxScore: 200, passingScore: 120, status: 'active', category: 'Tools', activityType: 'individual', completions: 121, avgScore: 160,
    questions: [
      { id: 'q1', prompt: 'What does `git rebase` do that `git merge` does not?', options: ['Creates a merge commit', 'Rewrites commit history to be linear', 'Deletes branches', 'Pushes to remote'], correctIndex: 1 },
      { id: 'q2', prompt: 'How do you undo the last commit but keep the changes staged?', options: ['git reset --hard HEAD~1', 'git reset --soft HEAD~1', 'git revert HEAD', 'git checkout HEAD~1'], correctIndex: 1 },
      { id: 'q3', prompt: 'What is `git cherry-pick` used for?', options: ['Merge two branches', 'Apply a specific commit from another branch', 'Delete a commit', 'Tag a release'], correctIndex: 1 },
    ],
  },
  {
    id: 'a10', name: 'Performance Profiling', description: 'Identify performance bottlenecks and apply optimization techniques.', instructions: 'Analyze performance scenarios and select the best optimization. Consider both frontend and backend.', difficulty: 'Medium', timeLimit: 360, maxScore: 200, passingScore: 120, status: 'inactive', category: 'Performance', activityType: 'individual', completions: 76, avgScore: 148,
    questions: [
      { id: 'q1', prompt: 'A page loads 20 unoptimized images. Quickest win?', options: ['Switch to HTTP/2', 'Lazy load below-the-fold images', 'Use a CDN', 'Reduce image count'], correctIndex: 1 },
      { id: 'q2', prompt: 'What does Lighthouse primarily measure?', options: ['Security', 'Performance & accessibility', 'SEO only', 'Server uptime'], correctIndex: 1 },
      { id: 'q3', prompt: 'Which technique reduces JavaScript parse time?', options: ['Code splitting', 'Inline CSS', 'Use PNGs', 'Disable caching'], correctIndex: 0 },
    ],
  },
  {
    id: 'a11', name: 'Testing Strategies', description: 'Write effective tests and understand testing pyramid concepts.', instructions: 'Choose the best testing approach for each scenario. Consider coverage, speed, and reliability.', difficulty: 'Easy', timeLimit: 240, maxScore: 100, passingScore: 60, status: 'active', category: 'Quality', activityType: 'individual', completions: 89, avgScore: 79,
    questions: [
      { id: 'q1', prompt: 'Which testing type runs fastest and is cheapest to maintain?', options: ['End-to-end', 'Integration', 'Unit', 'Manual'], correctIndex: 2 },
      { id: 'q2', prompt: 'What is a test stub?', options: ['A real database', 'A controlled replacement for a dependency', 'A type of assertion', 'A test runner'], correctIndex: 1 },
      { id: 'q3', prompt: 'What does TDD stand for?', options: ['Test-Driven Development', 'Total Data Design', 'Type Definition Document', 'Test Debug Daemon'], correctIndex: 0 },
    ],
  },
  {
    id: 'a12', name: 'DevOps Pipeline', description: 'Build a CI/CD pipeline with proper gates and deployment strategies.', instructions: 'Answer questions about CI/CD best practices. Consider automation, security, and rollback.', difficulty: 'Hard', timeLimit: 480, maxScore: 300, passingScore: 180, status: 'active', category: 'DevOps', activityType: 'group', completions: 41, avgScore: 228,
    questions: [
      { id: 'q1', prompt: 'What is the purpose of a pre-deployment gate in CI/CD?', options: ['Speed up builds', 'Block deployments that fail quality checks', 'Store artifacts', 'Notify users'], correctIndex: 1 },
      { id: 'q2', prompt: 'Which strategy allows instant rollback by switching traffic between two environments?', options: ['Canary', 'Rolling', 'Blue-green', 'Recreate'], correctIndex: 2 },
      { id: 'q3', prompt: 'What is infrastructure as code?', options: ['Writing docs about servers', 'Managing infrastructure through version-controlled config files', 'Manual server setup', 'Cloud console only'], correctIndex: 1 },
    ],
  },
];


export const activityLogs: ActivityLog[] = [
  { id: 'l1', userId: 'u1', userName: 'Alex Carter', activityId: 'a1', activityName: 'Code Review Sprint', difficulty: 'Easy', score: 92, timeTaken: 245, status: 'completed', date: '2026-08-14 09:30' },
  { id: 'l2', userId: 'u1', userName: 'Alex Carter', activityId: 'a3', activityName: 'Bug Hunt: Race Condition', difficulty: 'Medium', score: 160, timeTaken: 380, status: 'completed', date: '2026-08-13 14:20' },
  { id: 'l3', userId: 'u1', userName: 'Alex Carter', activityId: 'a4', activityName: 'API Design Quiz', difficulty: 'Easy', score: 88, timeTaken: 180, status: 'completed', date: '2026-08-12 10:15' },
  { id: 'l4', userId: 'u1', userName: 'Alex Carter', activityId: 'a2', activityName: 'System Design Challenge', difficulty: 'Hard', score: 210, timeTaken: 540, status: 'completed', date: '2026-08-11 16:00' },
  { id: 'l5', userId: 'u1', userName: 'Alex Carter', activityId: 'a6', activityName: 'Security Essentials', difficulty: 'Medium', score: 140, timeTaken: 300, status: 'completed', date: '2026-08-10 11:45' },
  { id: 'l6', userId: 'u1', userName: 'Alex Carter', activityId: 'a7', activityName: 'Agile Ceremonies', difficulty: 'Easy', score: 95, timeTaken: 150, status: 'completed', date: '2026-08-09 09:00' },
  { id: 'l7', userId: 'u1', userName: 'Alex Carter', activityId: 'a9', activityName: 'Git Mastery', difficulty: 'Medium', score: 175, timeTaken: 260, status: 'completed', date: '2026-08-08 13:30' },
  { id: 'l8', userId: 'u1', userName: 'Alex Carter', activityId: 'a5', activityName: 'Database Optimization', difficulty: 'Hard', score: 155, timeTaken: 590, status: 'failed', date: '2026-08-07 15:20' },
  { id: 'l9', userId: 'u1', userName: 'Alex Carter', activityId: 'a11', activityName: 'Testing Strategies', difficulty: 'Easy', score: 80, timeTaken: 200, status: 'completed', date: '2026-08-06 10:50' },
  { id: 'l10', userId: 'u1', userName: 'Alex Carter', activityId: 'a12', activityName: 'DevOps Pipeline', difficulty: 'Hard', score: 240, timeTaken: 450, status: 'completed', date: '2026-08-05 14:15' },
  { id: 'l11', userId: 'u1', userName: 'Alex Carter', activityId: 'a8', activityName: 'Cloud Architecture', difficulty: 'Hard', score: 195, timeTaken: 520, status: 'completed', date: '2026-08-04 11:00' },
  { id: 'l12', userId: 'u1', userName: 'Alex Carter', activityId: 'a10', activityName: 'Performance Profiling', difficulty: 'Medium', score: 120, timeTaken: 340, status: 'completed', date: '2026-08-03 16:40' },
];

export const adminLogs: AdminLog[] = [
  { id: 'al1', user: 'Admin Root', action: 'Created activity', target: 'DevOps Pipeline', timestamp: '2026-08-14 10:15', status: 'success' },
  { id: 'al2', user: 'Admin Root', action: 'Deactivated user', target: 'Kai Morton', timestamp: '2026-08-13 17:30', status: 'warning' },
  { id: 'al3', user: 'Admin Root', action: 'Edited activity', target: 'Database Optimization', timestamp: '2026-08-13 14:00', status: 'success' },
  { id: 'al4', user: 'Admin Root', action: 'Added user', target: 'Lane Bishop', timestamp: '2026-08-12 09:45', status: 'success' },
  { id: 'al5', user: 'Admin Root', action: 'Changed team', target: 'Harper Nash → Vortex', timestamp: '2026-08-11 11:20', status: 'success' },
  { id: 'al6', user: 'Admin Root', action: 'Deleted activity', target: 'Legacy Quiz (v1)', timestamp: '2026-08-10 15:00', status: 'error' },
  { id: 'al7', user: 'Admin Root', action: 'Activated activity', target: 'Cloud Architecture', timestamp: '2026-08-09 10:30', status: 'success' },
  { id: 'al8', user: 'Admin Root', action: 'Updated settings', target: 'Competition rules', timestamp: '2026-08-08 13:15', status: 'success' },
  { id: 'al9', user: 'Admin Root', action: 'Edited team', target: 'Phoenix', timestamp: '2026-08-07 16:45', status: 'success' },
  { id: 'al10', user: 'Admin Root', action: 'Reset password', target: 'EMP023', timestamp: '2026-08-06 09:00', status: 'warning' },
];

// Chart data
export const teamPerformanceData = teams.map(t => ({ name: t.name, score: t.score, color: t.color }));

export const individualPerformanceData = [
  { week: 'W1', score: 320 },
  { week: 'W2', score: 480 },
  { week: 'W3', score: 410 },
  { week: 'W4', score: 620 },
  { week: 'W5', score: 580 },
  { week: 'W6', score: 740 },
  { week: 'W7', score: 890 },
  { week: 'W8', score: 1240 },
];

export const difficultyBreakdown = [
  { difficulty: 'Easy', completed: 4, avgScore: 89, total: 4 },
  { difficulty: 'Medium', completed: 4, avgScore: 154, total: 5 },
  { difficulty: 'Hard', completed: 4, avgScore: 200, total: 4 },
];

export const completionRateData = [
  { label: 'Completed', value: 12, color: '#10b981' },
  { label: 'Remaining', value: 0, color: '#e2e8f0' },
];
