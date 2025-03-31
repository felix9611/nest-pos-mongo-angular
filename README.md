

<h1>Fixed Asset Management System</h1>
<p><strong>Nest.js & Angular SSR | Cloud-based Web Application for Asset Management</strong></p>
<p>Current version: V1.5 Branch </p>

<h2>🌟 Project Overview</h2>
<p>This is a full-stack <strong>Fixed Asset Management System</strong> built with <strong>Spring Boot</strong> and <strong>Angular SSR</strong>, designed for managing fixed assets within facilities. The system includes:</p>
<ul>
  <li>Purchase and maintenance record management</li>
  <li>Asset write-off tracking</li>
  <li>Status monitoring and reporting</li>
</ul>
<p>The system is <strong>cloud-based</strong>, significantly reducing IT infrastructure costs and improving usability, with no installation required.</p>

<p>🔗 <strong><a href="https://fixedasset-prod-felix9611-d3fc9544.koyeb.app/login" target="_blank">Online Demo</a></strong></p>
<p><strong>Username:</strong> <code>Demo</code><br>
<strong>Password:</strong> <code>888888</code></p>
<p><em>Note: Backend hosted on AWS with Nginx, Frontend on Koyeb.</em></p>

<h2>📸 Example Screenshots</h2>

<h3>Tax Information</h3>
<img src="https://github.com/felix9611/nest-fixedasset-mongo-angular/blob/dev/image/fixedasset-1.png" alt="Dashboard Overview">

<h3>Asset Form View</h3>
<img src="https://github.com/felix9611/nest-fixedasset-mongo-angular/blob/dev/image/fixedasset-2.png" alt="Asset List View">

<h3>User Info</h3>
<img src="https://github.com/felix9611/nest-fixedasset-mongo-angular/blob/dev/image/fixedasset-3.png" alt="Maintenance Records">

<h3>Dashboard</h3>
<img src="https://github.com/felix9611/nest-fixedasset-mongo-angular/blob/dev/image/fixedasset-4.png" alt="Write-Off Management">

<h2>🚀 Key Features</h2>
<ul>
  <li><strong>Comprehensive Asset Management:</strong> Manage asset status, purchase records, maintenance schedules, and write-offs.</li>
  <li><strong>Secure Authentication & Authorization:</strong> Utilizes <strong>JWT tokens</strong> for enhanced security and data protection.</li>
  <li><strong>Cloud-Based Architecture:</strong> Easy deployment and access without installation, lowering operational costs.</li>
  <li><strong>Real-Time Data Visualization:</strong> Integrated <strong>Chart.js</strong> for graphical representation of asset data.</li>
</ul>

<h2>⚙️ Tech Stack</h2>
<h3>Frontend:</h3>
<ul>
  <li>Angular 19.2</li>
  <li>Node.js 20</li>
  <li>Typescript</li>
  <li>Tailwind CSS</li>
  <li>Canvas.js 3.12.5</li>
  <!--<li>xlsx, jspdf for reporting and data export</li>-->
</ul>
<h3>Backend:</h3>
<ul>
  <li>Nest.js 11.0</li>
  <li>Mongoose 8.12.1 for database interaction</li>
  <li>MongoDB v8.0</li>
  <li>Nest.js OpenAPI UI 11.0 for API documentation</li>
</ul>

<h2>🛠️ Core Functionalities</h2>
<ul>
  <li><strong>Asset Registration & Tracking:</strong> Record and track fixed assets with detailed status and information.</li>
  <li><strong>Expenditure & Maintenance Management:</strong> Log asset purchase, maintenance, and write-off records for better financial control.</li>
  <li><strong>Dynamic Reporting:</strong> Showing chart graphs for easy analysis and sharing.</li>
  <li><strong>Role Permission:</strong> Unit by per role with menu page permission, customization user group(s) to actionable functions</li>
</ul>

<h2>📋 How to Run the Project</h2>

<h3>Backend</h3>
<pre><code>// Go to the backend's file directory
cd backend

// Install dependencies using maven
npm install
// or
yarn

// Run the backend
npm run start
// or
yarn start

Build the backend
npm run build
// or
yarn build


// API Documentation URL
http://localhost:7350/api
</code></pre>

<h3>Frontend</h3>
<pre><code>// Go to the frontend's file directory
cd frontend

// Install dependencies (npm)
npm install
// or
yarn

// Run the frontend
npm run start
// or
yarn start

// Build the frontend
npm run build:uat or build:prod
// or
yarn build:uat or build:prod

// Preview URL
http://localhost:4200
</code></pre>

<h2>🌐 Deployment</h2>
<ul>
  <li><strong>Database:</strong> Mongodb Atlas</li>
  <li><strong>Backend:</strong> AWS runing in Linux & Nginx</li>
  <li><strong>Frontend:</strong> Koyeb runing in Angualr SSR</li>
</ul>

<h2>📈 Business Impact</h2>
<ul>
  <li><strong>Reduced Operational Costs</strong> by eliminating the need for desktop installations.</li>
  <li><strong>Improved Data Security</strong> through JWT-based user authentication.</li>
  <li><strong>Enhanced Decision-Making</strong> with real-time data visualization and comprehensive reporting.</li>
</ul>
