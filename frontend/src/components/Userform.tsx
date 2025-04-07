import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";

// Zod validation schema
const formSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  Tenure: z.string().min(1, "Tenure is required"),
  Reason: z.string().min(1, "Reason is required"),
  Amount: z.string().min(1, "Amount is required"),
  EmploymentStatus: z.string().min(1, "Employment Status is required"),
  EmploymentAddress: z.string().min(1, "Employment Address is required"),
});

type Form = z.infer<typeof formSchema>;

function UserForm() {
  const [form, setForm] = useState<Form>({
    Name: "",
    Tenure: "",
    Reason: "",
    Amount: "",
    EmploymentStatus: "",
    EmploymentAddress: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const result = formSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      await axios.post("https://login-system-wqit.onrender.com/api/loan", form);
      setSuccess(true);
      setForm({
        Name: "",
        Tenure: "",
        Reason: "",
        Amount: "",
        EmploymentStatus: "",
        EmploymentAddress: ""
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h1>Apply For A Loan</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Loan Application Submitted!</p>}

      <input
        type="text"
        name="Name"
        placeholder="Enter your Name"
        value={form.Name}
        onChange={handleChange}
      />
      <br />

      <input
        type="text"
        name="Tenure"
        placeholder="Enter Loan Tenure (in months)"
        value={form.Tenure}
        onChange={handleChange}
      />
      <br />

      <input
        type="text"
        name="Reason"
        placeholder="Reason for Loan"
        value={form.Reason}
        onChange={handleChange}
      />
      <br />

      <input
        type="text"
        name="Amount"
        placeholder="Enter Loan Amount"
        value={form.Amount}
        onChange={handleChange}
      />
      <br />

      <select name="EmploymentStatus" value={form.EmploymentStatus} onChange={handleChange}>
        <option value="">Select Employment Status</option>
        <option value="Employed">Employed</option>
        <option value="Self-employed">Self-employed</option>
        <option value="Unemployed">Unemployed</option>
      </select>
      <br />

      <input
        type="text"
        name="EmploymentAddress"
        placeholder="Enter Employment Address"
        value={form.EmploymentAddress}
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSubmit}>Submit Form</button>
    </div>
  );
}

export default UserForm;
