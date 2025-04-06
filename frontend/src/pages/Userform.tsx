import React, { useState } from "react";

interface Form {
    Name: string;
    LoanId: string;
    Amount: string;
    Tenure: string;
    Reason: string;
    EmploymentStatus: string;
    EmploymentAddress: string;
}

function UserForm() {
    const [form, setForm] = useState<Form>({
        Name: "",
        LoanId: "",
        Amount: "",
        Tenure: "",
        Reason: "",
        EmploymentStatus: "",
        EmploymentAddress: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Form submitted", form);
    };

    return (
        <div>
            <h1>APPLY FOR A LOAN</h1>
            
            <h3>Enter Full name as it Appear on bank account</h3>
            <input 
                type="text" 
                name="Name"
                placeholder="Enter your Name"
                value={form.Name}
                onChange={handleChange}
            />

            <h3>Loan Tenure (in Months)</h3>
            <input 
                type="text" 
                name="Tenure"
                placeholder="Enter Loan Tenure"
                value={form.Tenure}
                onChange={handleChange}
            />

            <h3>Reason For Loan</h3>
            <input 
                type="text" 
                name="Reason"
                placeholder="Enter Loan Reason"
                value={form.Reason}
                onChange={handleChange}
            />

            <h3>How much do you need</h3>
            <input 
                type="text" 
                name="Amount"
                placeholder="Enter Loan Amount"
                value={form.Amount}
                onChange={handleChange}
            />

            <h3>Employment Status</h3> 
            <input 
                type="text" 
                name="EmploymentStatus"
                placeholder="Enter Employment Status"
                value={form.EmploymentStatus}
                onChange={handleChange}
            />

            <h3>Employment Address</h3> 
            <input 
                type="text" 
                name="EmploymentAddress"
                placeholder="Enter Employment Address"
                value={form.EmploymentAddress}
                onChange={handleChange}
            />

            <button onClick={handleSubmit}>
                Submit Form
            </button>
        </div>
    );
}

export default UserForm;