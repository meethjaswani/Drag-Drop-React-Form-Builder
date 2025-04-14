import React from "react";
import "./PreviewPage.css"; // Make sure this import exists at the top

function PreviewPage() {
  const formFields = JSON.parse(localStorage.getItem("formPreview") || "[]");

  return (
    <div className="preview-container">
      <h1 style={{ color: "purple", textAlign: "center", marginBottom: "30px" }}>Form Preview</h1>
      <div className="preview-form">
        {formFields.map((field, i) => {
          switch (field.type) {
            case "text":
              return (
                <div key={i} className="preview-field">
                  <label className="preview-label">{field.question}</label>
                  <input type="text" className="preview-input" />
                </div>
              );
            case "dropdown":
              return (
                <div key={i} className="preview-field">
                  <label className="preview-label">{field.question}</label>
                  <select className="preview-select">
                    {field.options.map((o, j) => (
                      <option key={j}>{o}</option>
                    ))}
                  </select>
                </div>
              );
            case "table":
              return (
                <div key={i} className="preview-field">
                  <label className="preview-label">{field.question}</label>
                  <div className="preview-table-columns">
                    {field.columns.map((col, j) =>
                      col === "dropdown" ? (
                        <select key={j} className="preview-select">
                          <option>Option 1</option>
                        </select>
                      ) : (
                        <input key={j} placeholder={col} className="preview-input" />
                      )
                    )}
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export default PreviewPage;