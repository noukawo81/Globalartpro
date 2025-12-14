import gapstudioRoutes from './routes/gapstudio.js';
import { AuthProvider } from "@/context/AuthContext.jsx";
// ...
app.use('/api/gapstudio', gapstudioRoutes);


ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);