import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OfferForm from "./OfferForm.jsx";
import { apiFetch } from "../../api.js";
import { toDateInputValue } from "../../utils/format.js";
import "./OfferFormPage.css";

// Create or edit a help offer — owned by Trupal Jageshkumar Patel
function OfferFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [initialValues, setInitialValues] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditing) return undefined;
    let active = true;
    apiFetch(`/api/offers/${id}`)
      .then((offer) => {
        if (!active) return;
        setInitialValues({
          title: offer.title,
          description: offer.description,
          category: offer.category,
          area: offer.area,
          date: toDateInputValue(offer.date),
          availability: offer.availability,
          spots: String(offer.spots),
          contactNote: offer.contactNote || "",
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
      await apiFetch(`/api/offers/${id}`, { method: "PUT", body: values });
    } else {
      await apiFetch("/api/offers", { method: "POST", body: values });
    }
    navigate("/my-offers");
  }

  return (
    <section className="offer-form-page">
      <h1 className="page-title">{isEditing ? "Edit your offer" : "Post an offer"}</h1>
      <p className="page-lede">
        Already making a trip or have a free afternoon? Say when, where, and
        how many people you can help.
      </p>

      {loadError && (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      )}
      {isEditing && !initialValues && !loadError && (
        <p role="status">Loading your offer…</p>
      )}
      {(!isEditing || initialValues) && (
        <OfferForm
          initialValues={initialValues || undefined}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Save changes" : "Post offer"}
          onCancel={() => navigate(-1)}
        />
      )}
    </section>
  );
}

OfferFormPage.propTypes = {};

export default OfferFormPage;
