import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [formFields, setFormFields] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");

  const components = [
    { type: "text", label: "Text Input", description: "Short or long text responses" },
    { type: "dropdown", label: "Dropdown", description: "Select from predefined options" },
    { type: "table", label: "Table", description: "Collect structured data in rows and columns" },
  ];

  const updateField = (index, key, value) => {
    const updated = [...formFields];
    updated[index][key] = value;
    setFormFields(updated);
  };

  const moveField = (from, to) => {
    const updated = [...formFields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFormFields(updated);
  };

  const deleteField = (index) => {
    const updated = [...formFields];
    updated.splice(index, 1);
    setFormFields(updated);
  };

  const goToPreview = () => {
    localStorage.setItem("formPreview", JSON.stringify(formFields));
    window.open("/preview", "_blank");
  };

  return (
    <div className="container">
      <div className="header">
      <h1 style={{ color: "purple", textAlign: "center", marginBottom: "30px" }}>Marketing Form Builder</h1>
        <button className="preview-btn" onClick={goToPreview}>Preview Form</button>
      </div>
      
      <div className="main-container">
        <div className="toolbox">
          <h2>Form Components</h2>
          {components.map((c, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("source", "toolbox");
                e.dataTransfer.setData("type", c.type);
                e.dataTransfer.effectAllowed = "move";
              }}
              className="toolbox-component"
            >
              <strong>{c.label}</strong>
              <p>{c.description}</p>
            </div>
          ))}
        </div>

        <div className="form-canvas-container">
          <div
            className={`form-canvas ${isDraggingOver ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const source = e.dataTransfer.getData("source");
              const type = e.dataTransfer.getData("type");

              if (source === "toolbox") {
                const newField = {
                  id: Date.now(),
                  type,
                  question: "",
                  options: [],
                  columns: [],
                };
                setFormFields([...formFields, newField]);
              }
            }}
          >
            <div className="form-header">
              <input
                className="form-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <textarea
                className="form-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Form Description"
              />
            </div>
            
            {formFields.length === 0 ? (
              <div className="drop-zone-indicator">
                Drag and drop components here to build your form
              </div>
            ) : (
              formFields.map((field, i) => (
                <div
                  key={field.id}
                  className="form-item"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("source", "form");
                    setDraggingIndex(i);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const source = e.dataTransfer.getData("source");
                    if (source === "form" && draggingIndex !== null && draggingIndex !== i) {
                      moveField(draggingIndex, i);
                      setDraggingIndex(null);
                    }
                  }}
                >
                  <div className="form-item-header">
                    <h3>Question {i + 1}</h3>
                    <button onClick={() => deleteField(i)}>Delete</button>
                  </div>
                  
                  <input
                    placeholder="Question Text"
                    value={field.question}
                    onChange={(e) => updateField(i, "question", e.target.value)}
                  />
                  
                  {field.type === "dropdown" && (
                    <>
                      <input
                        placeholder="Options (comma separated)"
                        onChange={(e) =>
                          updateField(i, "options", e.target.value.split(","))
                        }
                      />
                    </>
                  )}
                  
                  {field.type === "table" && (
                    <div className="table-settings">
                      <h4>Table Columns</h4>
                      {field.columns.map((col, colIndex) => (
                        <div key={colIndex} className="column-setting">
                          <input
                            placeholder={`Column ${colIndex + 1}`}
                            value={col}
                            onChange={(e) => {
                              const newColumns = [...field.columns];
                              newColumns[colIndex] = e.target.value;
                              updateField(i, "columns", newColumns);
                            }}
                          />
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newColumns = [...field.columns, ""];
                          updateField(i, "columns", newColumns);
                        }}
                      >
                        + Add Column
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;