


A web app "app.py" that receives facial metrics by two resources, pain and no pain, and uploads the sample to a corresponding MongoDB collection, along with "requirements.txt" the web app is deployed on AWS.

"index.html" and "process.js" are based on the Affectiva SDK, and modified to add two buttons, Pain and No Pain, upon clicking each, JS sends a POST request to the web app with the metrics to the corresponding resource.
