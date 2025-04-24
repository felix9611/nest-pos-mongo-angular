<h1>POS System</h1>
<p><strong>Nest.js & Angular SSR | Cloud-based Web Application for POS System</strong></p>
<p>NCPL（Non-Commercial Public License）</p>

<h2>🌟 Project Overview</h2>
<p>This is a full-stack <strong>POS (Point of Sale) System</strong> built with <strong>Nest.js</strong> and <strong>Angular SSR</strong>, It is designed for businesses to manage purchase orders, transactions, inventory, and product records.</p>
<ul>
  <li>Manage purchase orders and transaction history</li>
  <li>Track inventory and product records</li>
  <li>Generate real-time reports and export data</li>
</ul>
<p>The system is <strong>cloud-based</strong>, reducing IT infrastructure costs and offering ease of use with no installation required.</p>

<p>🔗 <strong><a href="https://pos.felix9611.com/login" target="_blank">Online Demo</a></strong></p>
<p><strong>Username:</strong> <code>Demo</code><br>
<strong>Password:</strong> <code>888888</code></p>
<p><em>Note: Backend and Frontend both hosted on self-hosted Raspberry Pi5 with Cloudflare</em></p>

<h2>📸 Example Images</h2>
<!-- Add example images here if available -->
<img src="https://github.com/felix9611/springboot-pos-vue/blob/main/image/pos-1.png" alt="Example Image 1">
<img src="https://github.com/felix9611/springboot-pos-vue/blob/main/image/pos-2.png" alt="Example Image 2">
<img src="https://github.com/felix9611/springboot-pos-vue/blob/main/image/pos-3.png" alt="Example Image 3">
<img src="https://github.com/felix9611/springboot-pos-vue/blob/main/image/pos-4.png" alt="Example Image 4">

<h2>🚀 Key Features</h2>
<ul>
  <li><strong>Comprehensive Purchase Order & Transaction Management</strong></li>
  <li><strong>Real-Time Inventory Tracking</strong></li>
  <li><strong>Member System Integration</strong></li>
  <li><strong>Secure Authentication & Authorization:</strong> Utilizes <strong>JWT tokens</strong> for data protection.</li>
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
http://localhost:7550/api
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
  <li><strong>Database:</strong> <del>Mongodb Atlas</del><strong>New experiment!</strong> Self-hosted in My Raspberry Pi5 server</li>
  <li><strong>Backend:</strong> <del>AWS runing in Linux & Nginx</del> <strong>New experiment!</strong> Fullset self-hosted server power by my Raspberry Pi5 server</li>
  <li><strong>Frontend:</strong> Koyeb OR Cloudflare Tunnel DNS + Raspberry Pi5 runing in Angualr SSR</li>
</ul>

<h2>📈 Business Impact</h2>
<ul>
  <li><strong>Improved Business Operations</strong> with real-time inventory tracking and reporting.</li>
  <li><strong>Enhanced Data Security</strong> through JWT-based user authentication.</li>
  <li><strong>Reduced Costs</strong> by eliminating the need for on-premise installations.</li>
</ul>