import React from "react";

function Card({ system, color, children }) {
  return (
    <div className={`system-card ${color}`}>
      <div className="name">{system}</div>
      <div className="body-text">{children}</div>
    </div>
  );
}

export default function SystemCards({ downstream }) {
  if (!downstream) return null;
  const { ehr, scheduling, notification } = downstream;

  return (
    <div className="system-cards">
      <Card system="Mock EHR API" color="ehr">
        <div><span className="k">ehrId </span>{ehr.ehrId}</div>
        <div><span className="k">name </span>{ehr.record.patientName}</div>
        <div><span className="k">dob </span>{ehr.record.dob}</div>
        <div><span className="k">location </span>{ehr.record.preferredLocation}</div>
        <div><span className="k">accepted </span>{String(ehr.accepted)}</div>
      </Card>

      <Card system="Mock Scheduling API" color="scheduling">
        <div><span className="k">schedulingId </span>{scheduling.schedulingId}</div>
        <div><span className="k">priority </span>{scheduling.priority}</div>
        <div><span className="k">queue </span>{scheduling.queue}</div>
        <div><span className="k">accepted </span>{String(scheduling.accepted)}</div>
      </Card>

      <Card system="Mock Notification API" color="notification">
        <div><span className="k">notificationId </span>{notification.notificationId}</div>
        <div><span className="k">channel </span>{notification.channel}</div>
        <div><span className="k">to </span>{notification.to || "(none)"}</div>
        <div><span className="k">accepted </span>{String(notification.accepted)}</div>
      </Card>
    </div>
  );
}
