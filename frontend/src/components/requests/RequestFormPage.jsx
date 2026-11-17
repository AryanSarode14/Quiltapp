import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestForm from "./RequestForm.jsx";
import EmergencyNotice from "../layout/EmergencyNotice.jsx";
import { apiFetch } from "../../api.js";
import { toDateInputValue } from "../../utils/format.js";
import "./RequestFormPage.css";

// Create or edit a help request — owned by Heta Vimaleshkumar Patel
function RequestFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [initialValues, setInitialValues] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditing) return undefined;
    let active = true;
    apiFetch(`/api/requests/${id}`)
      .then((request) => {
        if (!active) return;
        setInitialValues({
          title: request.title,
          description: request.description,
          category: request.category,
          urgency: request.urgency,
          area: request.area,
          neededBy: toDateInputValue(request.neededBy),
          contactNote: request.contactNote || "",
        });
      })
      .catch((err) => {
        if (active) setLoadError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id, isEditing]);

  async function handleSubmit(values) {
    if (isEditing) {
      await apiFetch(`/api/requests/${id}`, { method: "PUT", body: values });
    } else {
      await apiFetch("/api/requests", { method: "POST", body: values });
    }
    navigate("/my-requests");
  }

  return (
    <section className="request-form-page">
      <h1 className="page-title">{isEditing ? "Edit your request" : "Post a request"}</h1>
      <p className="page-lede">
        Be specific about what and when. People browse by area, so choose the
        one closest to you.
      </p>
      <div className="request-form-page-notice">
        <EmergencyNotice compact />
      </div>

      {loadError && (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      )}
      {isEditing && !initialValues && !loadError && (
        <p role="status">Loading your request…</p>
      )}
      {(!isEditing || initialValues) && (
        <RequestForm
          initialValues={initialValues || undefined}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Save changes" : "Post request"}
          onCancel={() => navigate(-1)}
        />
      )}
    </section>
  );
}

RequestFormPage.propTypes = {};

export default RequestFormPage;
