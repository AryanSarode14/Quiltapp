import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/shared/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RequestsPage from "./components/requests/RequestsPage.jsx";
import RequestFormPage from "./components/requests/RequestFormPage.jsx";
import MyRequestsPage from "./components/requests/MyRequestsPage.jsx";
import OffersPage from "./components/offers/OffersPage.jsx";
import OfferFormPage from "./components/offers/OfferFormPage.jsx";
import MyOffersPage from "./components/offers/MyOffersPage.jsx";
import ClaimedOffersPage from "./components/offers/ClaimedOffersPage.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route path="requests" element={<RequestsPage />} />
            <Route
              path="requests/new"
              element={
                <ProtectedRoute>
                  <RequestFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="requests/:id/edit"
              element={
                <ProtectedRoute>
                  <RequestFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-requests"
              element={
                <ProtectedRoute>
                  <MyRequestsPage />
                </ProtectedRoute>
              }
            />

            <Route path="offers" element={<OffersPage />} />
            <Route
              path="offers/new"
              element={
                <ProtectedRoute>
                  <OfferFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="offers/:id/edit"
              element={
                <ProtectedRoute>
                  <OfferFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-offers"
              element={
                <ProtectedRoute>
                  <MyOffersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-claims"
              element={
                <ProtectedRoute>
                  <ClaimedOffersPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

App.propTypes = {};

export default App;
