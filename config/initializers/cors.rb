# Configure CORS (Cross-Origin Resource Sharing)
# This allows your React app (running on a different port) to make API requests to Rails

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In development, React runs on port 5173 (Vite default)
    # In production, you'll update this to your actual React app domain
    origins ENV.fetch("FRONTEND_URL", "http://localhost:5173")

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true, # Allow cookies/auth headers
      expose: ["Authorization"] # Expose JWT token in response headers
  end
end
