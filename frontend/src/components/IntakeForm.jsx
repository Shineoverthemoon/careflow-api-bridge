import React, { useState } from "react";

const SAMPLE = {
  firstName: "Avery",
  lastName: "Synthetic-Demo",
  dateOfBirth: "1985-03-12",
  phone: "555-0142",
  email: "demo@example.com",
  appointmentType: "new-patient",
  urgency: "high",
  preferredLocation: "Downtown Clinic",
  notes: "Synthetic demo intake. No real patient data."
};

const EMPTY = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  appointmentType: "new-patient",
  urgency: "routine",
  preferredLocation: "",
  notes: ""
};

export default function IntakeForm({ onSubmit, onReset, submitting }) {
  const [form, setForm] = useState(SAMPLE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const loadSample = () => {
    setForm(SAMPLE);
    onReset();
  };

  const clear = () => {
    setForm(EMPTY);
    onReset();
  };

  return (
    <form className="intake-form" onSubmit={handleSubmit} data-testid="intake-form">
      <div className="field">
        <div className="row">
          <div className="field">
            <label>
              First Name<span className="req">*</span>
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Avery"
              data-testid="input-firstName"
            />
          </div>
          <div className="field">
            <label>
              Last Name<span className="req">*</span>
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Synthetic-Demo"
              data-testid="input-lastName"
            />
          </div>
        </div>
      </div>

      <div className="field">
        <label>
          Date of Birth<span className="req">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          data-testid="input-dateOfBirth"
        />
      </div>

      <div className="row">
        <div className="field">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="555-0100"
            data-testid="input-phone"
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="demo@example.com"
            data-testid="input-email"
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>
            Appointment Type<span className="req">*</span>
          </label>
          <select
            name="appointmentType"
            value={form.appointmentType}
            onChange={handleChange}
            data-testid="select-appointmentType"
          >
            <option value="new-patient">New Patient</option>
            <option value="follow-up">Follow-up</option>
            <option value="consult">Consult</option>
            <option value="lab-only">Lab Only</option>
          </select>
        </div>
        <div className="field">
          <label>Urgency</label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            data-testid="select-urgency"
          >
            <option value="routine">Routine</option>
            <option value="elevated">Elevated</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>
          Preferred Location<span className="req">*</span>
        </label>
        <input
          name="preferredLocation"
          value={form.preferredLocation}
          onChange={handleChange}
          placeholder="Downtown Clinic"
          data-testid="input-preferredLocation"
        />
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Synthetic only. No real patient data."
          data-testid="input-notes"
        />
      </div>

      <div className="btn-row">
        <button
          type="submit"
          className="btn primary"
          disabled={submitting}
          data-testid="submit-intake"
        >
          {submitting ? "Submitting…" : "Submit Intake"}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={loadSample}
          data-testid="sample-button"
        >
          Sample
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={clear}
          data-testid="clear-button"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
