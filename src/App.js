import React, { useState } from 'react';
// Import our new supabase client
import { supabase } from './supabaseClient';

// --- Data for our dependent dropdowns ---
// Reordered by SB, SBCs, then AGs, with roles in priority order
const societyRoles = {
  // SB
  'IEEE SB JECC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Technical Coordinator',
    'Event Coordinator',
    'Web Master',
    'Media Lead',
    'Content Lead',
    'Membership Development Lead',
    'Link Representative'
  ],
  // SBCs
  'IEEE PELS SBC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Event Coordinator',
    'Membership Development Lead',
    'Media Lead'
  ],
  'IEEE IAS SBC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Event Coordinator',
    'Membership Development Lead',
    'Media Lead'
  ],
  'IEEE IES SBC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Membership Development Lead',
    'Media Lead',
    'Content Lead'
  ],
  'IEEE PES SBC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Membership Development Lead',
    'Media Lead',
    'Content Lead'
  ],
  'IEEE SPS SBC': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Technical Coordinator',
    'Media Lead'
  ],
  // AGs
  'IEEE SIGHT AG': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Project Coordinator',
    'Membership Development Lead',
    'Media Lead',
    'Content Lead'
  ],
  'IEEE WIE AG': [
    'Chair',
    'Vice Chair',
    'Secretary',
    'Treasurer',
    'Joint Secretary',
    'Technical Coordinator',
    'Membership Development Lead',
    'Media Lead',
    'Content Lead'
  ]
};

const departments = [
  'CSE',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'AD',
  'CY',
  'MR',
  'RE',
  'Other',
];

// --- Roles restricted for First Years ---
const restrictedFirstYearRoles = [
  'Chair',
  'Vice Chair',
  'Secretary',
  'Joint Secretary',
  'Treasurer'
];

// --- Reusable Header Component ---
const Header = () => {
  return (
    <header className="w-full bg-white/50 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/30">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center p-5">
        <p className="text-xl font-bold text-blue-900">
          IEEE SB/SBCs/AGs Execom Selection
        </p>
      </div>
    </header>
  );
};

// --- Reusable Footer Component ---
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900/20 backdrop-blur-lg text-gray-700 text-center p-6">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} IEEE Student Branch. All Rights Reserved.
      </div>
    </footer>
  );
};

// --- Reusable Preference Selector Component ---
// This component shows a society dropdown and a dependent role dropdown
const PreferenceSelector = ({
  label,
  societyName,
  roleName,
  formData,
  handleChange,
  errorSociety,
  errorRole,
  year // Year is passed as a prop to filter roles
}) => {
  const selectedSociety = formData[societyName];
  
  // Filter roles based on year
  const baseAvailableRoles = selectedSociety ? societyRoles[selectedSociety] : [];
  const availableRoles = year === 'First'
    ? baseAvailableRoles.filter(role => !restrictedFirstYearRoles.includes(role))
    : baseAvailableRoles;
  
  const societies = Object.keys(societyRoles);

  return (
    <div className="md:col-span-2 p-4 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Society Dropdown */}
        <div>
          <label htmlFor={societyName} className="block text-sm font-medium text-gray-700 mb-1">
            SB/SBCs/AGs
          </label>
          <select
            id={societyName}
            name={societyName}
            value={selectedSociety}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none bg-white/70 backdrop-blur-sm border-gray-300/70 focus:bg-white ${errorSociety ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
          >
            <option value="">-- Select an SB/SBC/AG --</option>
            {societies.map((society) => (
              <option key={society} value={society}>
                {society}
              </option>
            ))}
          </select>
          {errorSociety && <p className="text-red-500 text-sm mt-1">{errorSociety}</p>}
        </div>

        {/* Role Dropdown (Dependent) */}
        <div>
          <label htmlFor={roleName} className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id={roleName}
            name={roleName}
            value={formData[roleName]}
            onChange={handleChange}
            disabled={!selectedSociety} // Disabled until a society is chosen
            className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none disabled:bg-gray-100/70 bg-white/70 backdrop-blur-sm border-gray-300/70 focus:bg-white ${errorRole ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
          >
            <option value="">-- Select a Role --</option>
            {/* This now uses the filtered list of roles */}
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errorRole && <p className="text-red-500 text-sm mt-1">{errorRole || ' '}</p>}
        </div>
      </div>
    </div>
  );
};

// --- Reusable Form Input Component ---
// This simplifies validation display
const FormInput = ({ id, label, error, children }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// --- Progress Bar Component ---
const ProgressBar = ({ currentStep, totalSteps }) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const steps = [
    { number: 1, title: 'Personal' },
    { number: 2, title: 'Preferences' },
    { number: 3, title: 'Qualifications' },
    { number: 4, title: 'Commitment' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="relative pt-10">
        <div className="absolute top-12 left-0 w-full h-1 bg-gray-300/70 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-300/70 text-gray-600'}`}>
                {step.number}
              </div>
              <p className={`mt-2 text-xs font-semibold ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- The Main Application Form Component ---
const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    regNo: '',
    department: '',
    year: '',
    isMember: 'No',
    membershipId: '',
    pref1_society: '',
    pref1_role: '',
    pref2_society: '',
    pref2_role: '',
    pref3_society: '',
    pref3_role: '',
    whyApply: '',
    prevPosition: 'No',
    prevPositionDetails: '',
    relevantSkills: '',
    eventsParticipated: '',
    contributionIdeas: '',
    networkingComfort: '',
    commitment: '',
    portfolioLink: '',
    portfolioFile: null,
    declaration: false,
    declaration_first_year_membership: false, // New state for the new checkbox
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const totalSteps = 4;

  // --- Step Validation Functions ---

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email ID is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    const phoneRegex = /^\d{10}$/; // Simple 10-digit validation
    if (!formData.phone) {
      newErrors.phone = 'Contact Number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit contact number.';
    }
    if (!formData.regNo.trim()) newErrors.regNo = 'Register Number is required.';
    if (!formData.department) newErrors.department = 'Please select your department.';
    if (!formData.year) newErrors.year = 'Please select your year of study.';

    // --- New Membership Validation Logic ---
    if (formData.year === 'First') {
      // First years: only check ID if they say they are a member
      if (formData.isMember === 'Yes' && !formData.membershipId.trim()) {
        newErrors.membershipId = 'IEEE Membership ID is required.';
      }
    } else if (formData.year === 'Second' || formData.year === 'Third') {
      // Second/Third years: ID is mandatory
      if (!formData.membershipId.trim()) {
        newErrors.membershipId = 'IEEE Membership ID is required.';
      }
    }
    // --- End New Logic ---

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.pref1_society) newErrors.pref1_society = 'First preference is required.';
    if (!formData.pref1_role) newErrors.pref1_role = 'First preference role is required.';
    if (!formData.pref2_society) newErrors.pref2_society = 'Second preference is required.';
    if (!formData.pref2_role) newErrors.pref2_role = 'Second preference role is required.';
    if (!formData.pref3_society) newErrors.pref3_society = 'Third preference is required.';
    if (!formData.pref3_role) newErrors.pref3_role = 'Third preference role is required.';
    
    const pref1 = formData.pref1_society && formData.pref1_role ? `${formData.pref1_society}-${formData.pref1_role}` : null;
    const pref2 = formData.pref2_society && formData.pref2_role ? `${formData.pref2_society}-${formData.pref2_role}` : null;
    const pref3 = formData.pref3_society && formData.pref3_role ? `${formData.pref3_society}-${formData.pref3_role}` : null;

    if (pref1) {
      if (pref2 && pref2 === pref1) {
        newErrors.pref2_society = 'Second preference cannot be the same as the first.';
        newErrors.pref2_role = ' ';
      }
      if (pref3) {
        if (pref3 === pref1) {
          newErrors.pref3_society = 'Third preference cannot be the same as the first.';
          newErrors.pref3_role = ' ';
        } else if (pref2 && pref3 === pref2) {
          newErrors.pref3_society = 'Third preference cannot be the same as the second.';
          newErrors.pref3_role = ' ';
        }
      }
    }
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.whyApply.trim()) newErrors.whyApply = 'This field is required.';
    if (!formData.relevantSkills.trim()) newErrors.relevantSkills = 'This field is required.';
    if (!formData.eventsParticipated.trim()) newErrors.eventsParticipated = 'This field is required.';
    if (!formData.contributionIdeas.trim()) newErrors.contributionIdeas = 'This field is required.';
    if (!formData.networkingComfort) newErrors.networkingComfort = 'Please select a rating.';
    if (formData.prevPosition === 'Yes' && !formData.prevPositionDetails.trim()) {
      newErrors.prevPositionDetails = 'Please mention your role and responsibilities.';
    }
    const isMediaLead = formData.pref1_role === 'Media Lead' || formData.pref2_role === 'Media Lead' || formData.pref3_role === 'Media Lead';
    if (isMediaLead && !formData.portfolioLink.trim() && !formData.portfolioFile) {
      newErrors.portfolio = 'As a Media Lead applicant, please provide either a portfolio link or upload a file.';
    }

    // --- NEW: Check file size on client side ---
    if (formData.portfolioFile && formData.portfolioFile.size > 52428800) { // 50MB
       newErrors.portfolio = `File is too large (${(formData.portfolioFile.size / 1024 / 1024).toFixed(1)}MB). Max size is 50MB.`;
    }

    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.commitment) newErrors.commitment = 'Please rate your commitment and availability.';
    if (!formData.declaration) {
      newErrors.declaration = 'You must agree to the main declaration.';
    }
    
    // --- New First Year Declaration Check ---
    if (formData.year === 'First' && formData.isMember === 'No' && !formData.declaration_first_year_membership) {
      newErrors.declaration_first_year_membership = 'You must agree to take membership to be considered.';
    }
    // --- End New Logic ---

    return newErrors;
  };


  // A single handler for all form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevData) => {
      const newData = {
        ...prevData,
      };

      // Handle file input
      if (type === 'file') {
        newData[name] = files[0] || null; // Store the first file or null
      } else {
        // Handle all other inputs
        newData[name] = type === 'checkbox' ? checked : value;
      }

      // Reset role if the corresponding society changes
      if (name === 'pref1_society') newData.pref1_role = '';
      if (name === 'pref2_society') newData.pref2_role = '';
      if (name === 'pref3_society') newData.pref3_role = '';
      
      // Reset membership ID if user selects "No"
      if (name === 'isMember' && value === 'No') {
        newData.membershipId = '';
      }

      // --- New Logic for Year Change ---
      if (name === 'year') {
        // If changing to 2nd/3rd year, set isMember to 'Yes' (implicitly)
        if(value === 'Second' || value === 'Third') {
          newData.isMember = 'Yes';
        }
        // If changing to 1st year, reset isMember to 'No'
        if(value === 'First') {
          newData.isMember = 'No';
          newData.membershipId = ''; // Also clear membership ID
        }
      }
      // --- End New Logic ---


      // If user changes year to "First", reset any invalid roles
      if (name === 'year' && value === 'First') {
        if (restrictedFirstYearRoles.includes(prevData.pref1_role)) {
          newData.pref1_role = '';
        }
        if (restrictedFirstYearRoles.includes(prevData.pref2_role)) {
          newData.pref2_role = '';
        }
        if (restrictedFirstYearRoles.includes(prevData.pref3_role)) {
          newData.pref3_role = '';
        }
      }

      // If user selects "No" for prevPosition, clear details
      if (name === 'prevPosition' && value === 'No') {
        newData.prevPositionDetails = '';
      }

      return newData;
    });

    // Clear validation error for this field as user is typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    // Clear portfolio error if user starts filling one of the fields
    if (name === 'portfolioLink' || name === 'portfolioFile') {
      if (errors.portfolio) {
        setErrors((prevErrors) => ({ ...prevErrors, portfolio: null }));
      }
    }
  };

  // --- Navigation Handlers ---

  const nextStep = () => {
    let stepErrors = {};
    if (currentStep === 1) stepErrors = validateStep1();
    if (currentStep === 2) stepErrors = validateStep2();
    if (currentStep === 3) stepErrors = validateStep3();
    
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setSubmitMessage('Please correct the errors in this section.');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({}); // Clear errors when going back
    setSubmitMessage('');
    window.scrollTo(0, 0);
  };

  // Handle final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    // Re-validate all steps just in case
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    const step3Errors = validateStep3();
    const step4Errors = validateStep4();

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors, ...step4Errors };
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      // Find the first step with an error and go to it
      if (Object.keys(step1Errors).length > 0) setCurrentStep(1);
      else if (Object.keys(step2Errors).length > 0) setCurrentStep(2);
      else if (Object.keys(step3Errors).length > 0) setCurrentStep(3);
      else setCurrentStep(4);
      
      setSubmitMessage('Please correct the errors in the form.');
      window.scrollTo(0, 0); // Scroll to top to see errors
      return;
    }

    setErrors({}); // Clear errors
    setIsSubmitting(true);
    setSubmitMessage('Submitting your application...');

    // --- START: Supabase Logic ---
    try {
      let publicFileUrl = null;

      // 1. Handle File Upload (if one exists)
      if (formData.portfolioFile) {
        const file = formData.portfolioFile;

        // --- NEW: Client-side file size check just before upload ---
        if (file.size > 52428800) { // 50MB
          throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 50MB.`);
        }

        // Create a unique file path
        const filePath = `portfolios/${Date.now()}_${file.name}`;

        const { error: storageError } = await supabase.storage
          .from('portfolios') // The bucket name from Part 1
          .upload(filePath, file);

        if (storageError) {
          // Check if it's a file size error from the server
          if (storageError.message.includes('File size exceeds')) {
            throw new Error('File is too large. Max size is 50MB.');
          }
          throw storageError;
        }

        // 2. Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from('portfolios')
          .getPublicUrl(filePath);
        
        publicFileUrl = urlData.publicUrl;
      }

      // 3. Prepare data for the database
      // We remove the 'portfolioFile' object and add the 'portfolio_file_url' string
      const { portfolioFile, ...dbData } = formData;
      const dataToInsert = {
        ...dbData,
        portfolio_file_url: publicFileUrl,
      };

      // 4. Insert the form data into the 'applications' table
      const { error: dbError } = await supabase
        .from('applications') // The table name from Part 1
        .insert([dataToInsert]);

      if (dbError) {
        throw dbError;
      }

      // 5. Success!
      setIsSubmitting(false);
      // setSubmitMessage is handled by renderSuccessMessage now
      setCurrentStep(5); // Show success message

    } catch (error) {
      // 6. Handle any errors
      console.error('Error submitting form:', error.message);
      setIsSubmitting(false);
      setSubmitMessage(`Error submitting application: ${error.message}. Please try again.`);
      // If it was a portfolio error, go to that step
      if (error.message.includes('File is too large')) {
        setCurrentStep(3);
        setErrors({ ...errors, portfolio: error.message });
      }
    }
    // --- END: Supabase Logic ---
  };

  // Check if Media Lead is selected in any preference
  const isMediaLead = formData.pref1_role === 'Media Lead' ||
                      formData.pref2_role === 'Media Lead' ||
                      formData.pref3_role === 'Media Lead';
  
  // Base classes for inputs
  const inputClasses = (hasError) => 
    `w-full p-3 border rounded-md focus:ring-2 focus:outline-none bg-white/70 backdrop-blur-sm border-gray-300/70 focus:bg-white transition-all duration-300 ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
    }`;

  // --- Button Components ---
  const NavigationButtons = () => (
    <div className="p-6 bg-white/50 border-t border-white/30">
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="w-full md:w-auto bg-gray-600 text-white font-bold py-3 px-10 rounded-md shadow-lg hover:bg-gray-700 transition duration-300 transform transition-transform hover:scale-105 active:scale-95"
            >
              Previous
            </button>
          )}
        </div>
        
        {/* Next/Submit Button */}
        <div>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full md:w-auto bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg hover:bg-blue-800 transition duration-300 transform transition-transform hover:scale-105 active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-10 rounded-md shadow-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform transition-transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
      {/* Submission Message Area */}
      {submitMessage && (
        <p className={`mt-4 text-center text-sm font-medium ${
          submitMessage.includes('successfully') ? 'text-green-800' : 
          submitMessage.includes('errors') ? 'text-red-800' : 'text-gray-800'
        }`}>
          {submitMessage}
        </p>
      )}
    </div>
  );
  
  // --- Step Rendering ---

  const renderStep1 = () => (
    <div className="animate-fade-in">
      {/* Form Header */}
      <div className="p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-900 pb-3 border-b-2 border-blue-300/50">
          Personal Information
        </h2>
        <p className="text-gray-600 mt-2">
          Please fill out your details accurately.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <FormInput id="name" label="Full Name" error={errors.name}>
          <input
            type="text" id="name" name="name"
            value={formData.name} onChange={handleChange}
            className={inputClasses(errors.name)}
          />
        </FormInput>

        {/* Register Number */}
        <FormInput id="regNo" label="Register Number" error={errors.regNo}>
          <input
            type="text" id="regNo" name="regNo"
            value={formData.regNo} onChange={handleChange}
            className={inputClasses(errors.regNo)}
          />
        </FormInput>

        {/* Email */}
        <FormInput id="email" label="Email ID" error={errors.email}>
          <input
            type="email" id="email" name="email"
            value={formData.email} onChange={handleChange}
            className={inputClasses(errors.email)}
          />
        </FormInput>

        {/* Phone */}
        <FormInput id="phone" label="Contact Number" error={errors.phone}>
          <input
            type="tel" id="phone" name="phone"
            value={formData.phone} onChange={handleChange}
            placeholder="10-digit number"
            className={inputClasses(errors.phone)}
          />
        </FormInput>
        
        {/* Department */}
        <FormInput id="department" label="Department" error={errors.department}>
          <select
            id="department" name="department"
            value={formData.department} onChange={handleChange}
            className={inputClasses(errors.department)}
          >
            <option value="">-- Select your department --</option>
            {departments.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
          </select>
        </FormInput>

        {/* Year of Study */}
        <FormInput id="year" label="Year of Study" error={errors.year}>
          <select
            id="year" name="year"
            value={formData.year} onChange={handleChange}
            className={inputClasses(errors.year)}
          >
            <option value="">-- Select your year --</option>
            <option value="First">First Year</option>
            <option value="Second">Second Year</option>
            <option value="Third">Third Year</option>
          </select>
        </FormInput>

        {/* --- NEW CONDITIONAL MEMBERSHIP SECTION --- */}

        {/* For First Years: Ask if member */}
        {formData.year === 'First' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="isMember" label="Are you an IEEE Member?" error={errors.isMember}>
              <div className="flex gap-x-6 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio" name="isMember" value="Yes"
                    checked={formData.isMember === 'Yes'} onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio" name="isMember" value="No"
                    checked={formData.isMember === 'No'} onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </FormInput>

            {/* If First Year AND Member: Ask for ID */}
            {formData.isMember === 'Yes' && (
              <FormInput id="membershipId" label="IEEE Membership ID" error={errors.membershipId}>
                <input
                  type="text" id="membershipId" name="membershipId"
                  value={formData.membershipId} onChange={handleChange}
                  placeholder="Enter your membership ID"
                  className={inputClasses(errors.membershipId)}
                />
              </FormInput>
            )}
          </div>
        )}

        {/* For Second/Third Years: ID is mandatory */}
        {(formData.year === 'Second' || formData.year === 'Third') && (
          <div className="md:col-span-2">
            <FormInput id="membershipId" label="IEEE Membership ID (Mandatory)" error={errors.membershipId}>
              <input
                type="text" id="membershipId" name="membershipId"
                value={formData.membershipId} onChange={handleChange}
                placeholder="Enter your membership ID"
                className={inputClasses(errors.membershipId)}
              />
            </FormInput>
          </div>
        )}
        
        {/* --- END NEW SECTION --- */}

      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      {/* --- Preferences --- */}
      <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 pb-3 border-b-2 border-blue-300/50">
          Preferences
        </h2>
        <p className="text-gray-600 mt-2 mb-4">
          Please select your top three preferences. Your role will be reset if you change the society.
        </p>
        {/* --- NEW HIGHLIGHTED NOTE --- */}
        <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
          <p className="font-medium text-blue-800">
            Note: There may be additional selection procedures based on the roles you select.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Preference */}
        <PreferenceSelector
          label="First Preference"
          societyName="pref1_society" roleName="pref1_role"
          formData={formData} handleChange={handleChange}
          errorSociety={errors.pref1_society} errorRole={errors.pref1_role}
          year={formData.year}
        />

        {/* Second Preference */}
        <PreferenceSelector
          label="Second Preference"
          societyName="pref2_society" roleName="pref2_role"
          formData={formData} handleChange={handleChange}
          errorSociety={errors.pref2_society} errorRole={errors.pref2_role}
          year={formData.year}
        />

        {/* Third Preference */}
        <PreferenceSelector
          label="Third Preference"
          societyName="pref3_society" roleName="pref3_role"
          formData={formData} handleChange={handleChange}
          errorSociety={errors.pref3_society} errorRole={errors.pref3_role}
          year={formData.year}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      {/* --- Qualifications & Skills --- */}
      <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 pb-3 border-b-2 border-blue-300/50">
          Skills & Other Qualification
        </h2>
        <p className="text-gray-600 mt-2 mb-4">
          Please describe your skills, experiences, and achievements that make you a suitable candidate.
        </p>
      </div>

      <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why do you want to apply? */}
        <div className="md:col-span-2">
          <FormInput id="whyApply" label="Why do you want to apply for this/these position(s)?" error={errors.whyApply}>
            <textarea
              id="whyApply" name="whyApply" rows="5"
              value={formData.whyApply} onChange={handleChange}
              className={inputClasses(errors.whyApply)}
            ></textarea>
          </FormInput>
        </div>

        {/* Have you previously held any position? */}
        <div className="md:col-span-2">
          <FormInput id="prevPosition" label="Have you previously held any position in IEEE or other organizations?" error={errors.prevPosition}>
            <div className="flex gap-x-6 mt-2">
              <label className="flex items-center">
                <input
                  type="radio" name="prevPosition" value="Yes"
                  checked={formData.prevPosition === 'Yes'} onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio" name="prevPosition" value="No"
                  checked={formData.prevPosition === 'No'} onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </FormInput>
        </div>

        {/* If Yes: Role and responsibilities */}
        {formData.prevPosition === 'Yes' && (
          <div className="md:col-span-2">
            <FormInput id="prevPositionDetails" label="If Yes: Please mention your role and responsibilities." error={errors.prevPositionDetails}>
              <textarea
                id="prevPositionDetails" name="prevPositionDetails" rows="4"
                value={formData.prevPositionDetails} onChange={handleChange}
                className={inputClasses(errors.prevPositionDetails)}
              ></textarea>
            </FormInput>
          </div>
        )}

        {/* Relevant Skills */}
        <div className="md:col-span-2">
          <FormInput id="relevantSkills" label="List your skills relevant to the applied position(s)" error={errors.relevantSkills}>
            <textarea
              id="relevantSkills" name="relevantSkills" rows="5"
              value={formData.relevantSkills} onChange={handleChange}
              className={inputClasses(errors.relevantSkills)}
            ></textarea>
          </FormInput>
        </div>

        {/* Events Participated */}
        <div className="md:col-span-2">
          <FormInput id="eventsParticipated" label="Mention any IEEE or non-IEEE events/initiatives you have actively participated in:" error={errors.eventsParticipated}>
            <textarea
              id="eventsParticipated" name="eventsParticipated" rows="5"
              value={formData.eventsParticipated} onChange={handleChange}
              className={inputClasses(errors.eventsParticipated)}
            ></textarea>
          </FormInput>
        </div>

        {/* Contribution Ideas */}
        <div className="md:col-span-2">
          <FormInput id="contributionIdeas" label="How do you plan to contribute to IEEE SB JECC as an EXECOM member? Share any new ideas or initiatives you would like to bring forward." error={errors.contributionIdeas}>
            <textarea
              id="contributionIdeas" name="contributionIdeas" rows="5"
              value={formData.contributionIdeas} onChange={handleChange}
              className={inputClasses(errors.contributionIdeas)}
            ></textarea>
          </FormInput>
        </div>

        {/* Networking Comfort */}
        <div className="md:col-span-2">
          <FormInput id="networkingComfort" label="On a scale of 1 to 5, how comfortable are you with approaching and networking with new people (peers, faculty, professionals)?" error={errors.networkingComfort}>
            <div className="flex justify-around items-center mt-3 p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl">
              {[1, 2, 3, 4, 5].map(v => (
                <label key={v} className="flex flex-col items-center">
                  <span className="text-sm">{v}</span>
                  <input
                    type="radio" name="networkingComfort" value={v.toString()}
                    checked={formData.networkingComfort === v.toString()}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                  />
                </label>
              ))}
            </div>
          </FormInput>
        </div>

        {/* --- Media Lead Portfolio (Conditional) --- */}
        {isMediaLead && (
          <>
            <div className="md:col-span-2 border-t border-gray-300/50 pt-6 mt-6">
              <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b-2 border-blue-300/50">
                Media Lead - Portfolio Upload
              </h3>
              <p className="text-gray-600 mt-2 mb-4">
                This section is <strong>only for applicants who have selected "Media Lead"</strong> as one of their preferred positions. Please upload or link your best creative work.
              </p>
              {errors.portfolio && <p className="text-red-600 text-sm font-semibold p-3 bg-red-50/80 border border-red-200 rounded-md -mt-2 mb-4">{errors.portfolio}</p>}
            </div>

            <div className="md:col-span-2">
              <FormInput id="portfolioLink" label="Portfolio Link (Behance, Google Drive, etc.)" error={null}>
                <input
                  type="url" id="portfolioLink" name="portfolioLink"
                  value={formData.portfolioLink} onChange={handleChange}
                  placeholder="https://..."
                  className={inputClasses(errors.portfolio)}
                />
              </FormInput>
            </div>
            
            <div className="md:col-span-2 flex items-center">
                <div className="flex-grow border-t border-gray-300/50"></div>
                <span className="mx-4 text-gray-500 font-semibold">OR</span>
                <div className="flex-grow border-t border-gray-300/50"></div>
            </div>

            <div className="md:col-span-2">
              <FormInput id="portfolioFile" label="Upload Best Works (image, video, or .pdf - Max 50MB)" error={null}>
                <input
                  type="file" id="portfolioFile" name="portfolioFile"
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50/70 file:text-blue-700 hover:file:bg-blue-100/70 bg-white/70 backdrop-blur-sm border-gray-300/70 focus:bg-white ${errors.portfolio ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                  accept="image/*,video/*,.pdf"
                />
                <p className="text-sm text-gray-500 mt-1">Tip: You can upload image, video, or PDF files. Max 50MB.</p>
              </FormInput>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-fade-in">
      {/* --- Declaration & Commitment --- */}
      <div className="p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-900 pb-3 border-b-2 border-blue-300/50">
          Declaration & Commitment
        </h2>
          <p className="text-gray-600 mt-2 mb-4">
          Before submitting, please review your responses carefully. By confirming below, you agree to take up responsibilities sincerely and contribute actively to IEEE SB JECC if selected as part of the EXECOM 2026 team.
        </p>
      </div>

      <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commitment Rating */}
        <div className="md:col-span-2">
          <FormInput id="commitment" label="Rate your commitment and availability to work for IEEE JECC throughout 2026" error={errors.commitment}>
            <div className="flex justify-around items-center mt-3 p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl">
              <label className="flex flex-col items-center px-2">
                <span className="text-sm">1</span>
                <span className="text-xs text-gray-500 hidden sm:block">Not much available</span>
                <input
                  type="radio" name="commitment" value="1"
                  checked={formData.commitment === '1'} onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                />
              </label>
              <label className="flex flex-col items-center px-2">
                <span className="text-sm">2</span>
                <input
                  type="radio" name="commitment" value="2"
                  checked={formData.commitment === '2'} onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                />
              </label>
              <label className="flex flex-col items-center px-2">
                <span className="text-sm">3</span>
                <input
                  type="radio" name="commitment" value="3"
                  checked={formData.commitment === '3'} onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                />
              </label>
              <label className="flex flex-col items-center px-2">
                <span className="text-sm">4</span>
                <input
                  type="radio" name="commitment" value="4"
                  checked={formData.commitment === '4'} onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                />
              </label>
              <label className="flex flex-col items-center px-2">
                <span className="text-sm">5</span>
                <span className="text-xs text-gray-500 hidden sm:block">Fully committed</span>
                <input
                  type="radio" name="commitment" value="5"
                  checked={formData.commitment === '5'} onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                />
              </label>
            </div>
          </FormInput>
        </div>

        {/* Declaration Checkbox */}
        <div className="md:col-span-2 flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="declaration" name="declaration" type="checkbox"
              checked={formData.declaration} onChange={handleChange}
              className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="declaration" className="font-medium text-gray-700">
              I hereby declare that all the information provided above is true to the best of my knowledge. I am willing to actively contribute to IEEE SB JECC if selected as a member of EXECOM 2026.
            </label>
          </div>
        </div>
        {errors.declaration && <p className="text-red-500 text-sm mt-1 md:col-span-2">{errors.declaration}</p>}
        
        {/* --- NEW First Year Membership Declaration --- */}
        {formData.year === 'First' && formData.isMember === 'No' && (
          <div className="md:col-span-2 flex items-start mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-lg">
            <div className="flex items-center h-5">
              <input
                id="declaration_first_year_membership" name="declaration_first_year_membership" type="checkbox"
                checked={formData.declaration_first_year_membership} onChange={handleChange}
                className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="declaration_first_year_membership" className="font-medium text-blue-800">
                I am not currently an IEEE member. I agree to take IEEE membership before 31 December 2025. I understand I will not be considered for the position if I fail to do so.
              </label>
            </div>
          </div>
        )}
        {errors.declaration_first_year_membership && <p className="text-red-500 text-sm mt-1 md:col-span-2">{errors.declaration_first_year_membership}</p>}

      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="animate-fade-in p-6 md:p-12 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        🎉 Thank you for applying for the IEEE Execom 2026!
      </h2>
      <p className="text-lg text-gray-800 mb-4">
        There will be a selection procedure based on the information you've provided and further evaluation rounds.
      </p>
      <p className="text-lg text-gray-800 mb-4">
        From this process, we will finalize the members of the IEEE Execom 2026.
      </p>
      <p className="text-lg text-gray-800 font-semibold">
        Stay tuned for further updates! 💫
      </p>
    </div>
  );

  return (
    <div className="flex-grow container mx-auto p-4 md:p-12 max-w-5xl">
      <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          IEEE Execom 2026 Selections
        </h1>
        <p className="text-lg text-gray-600 mt-2">Application Form</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden border border-white/40 animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        {/* Render progress bar only if not on success step */}
        {currentStep <= totalSteps && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}
        
        {/* Render the current step based on state */}
        <div className="form-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderSuccessMessage()}
        </div>

        {/* Render navigation only if not on success step */}
        {currentStep <= totalSteps && (
          <NavigationButtons />
        )}
      </form>
    </div>
  );
};

// --- Main App Component ---
// This is the default export that renders everything
function App() {
  return (
    // We use flex-col and min-h-screen to make the footer sticky
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 bg-fixed font-inter">
      <Header />
      <ApplicationForm />
      <Footer />
    </div>
  );
}

export default App;

