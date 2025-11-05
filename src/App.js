import React, { useState, useEffect } from 'react';
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

// --- Data for the new Landing Page ---
const roleDescriptions = [
  {
    name: "IEEE SB JECC (Student Branch)",
    description: "The IEEE SB JECC is the core of our campus community. It's the parent organization that supports all our technical and non-technical activities, giving members access to funding, resources, and a network of peers and mentors to build their skills outside the classroom.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the Student Branch. Run all official meetings of the branch and the executive committee. Act as the main contact for faculty, industry professionals, and the wider IEEE section. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the workload. Act as the leader of the branch in the Chair's absence. Oversee all branch committees and help manage the year's activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the branch. Maintain all official records. Keep detailed minutes of all meetings. Manage all branch correspondence. Ensure all branch events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the branch's finances. Maintain all financial accounts and prepare the annual budget. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Help track activity reports from all sub-committees and teams. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Technical Coordinator", description: "Manage all technology for branch events, such as A/V, lab equipment, and software. Plan and lead the branch's technical events, like coding workshops, hackathons, and seminars. Act as the main technical advisor for the executive committee." },
      { name: "Event Coordinator", description: "Plan, organize, and manage all branch events from start to finish. Handle all event logistics, including booking venues, coordinating with speakers, and arranging tech setups. Maintain the branch's official calendar of events. Work with the communications team to promote events." },
      { name: "Web Master", description: "Act as the digital face of our branch. Build, maintain, and regularly update the official branch website. Work closely with the Media and Content leads to publish event information and articles. Oversee improvements and new features for the branch website." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the branch. Manage all of the branch's social media accounts. Create and share posts to promote events, share news, and engage with our members. Develop digital marketing campaigns to grow our online community." },
      { name: "Content Lead", description: "Act as the branch's storyteller. Create, write, and edit compelling content for all platforms (website, social media, newsletters). Write content that captures our activities and communicates the branch's value. Collaborate with the Media Lead and Web Master to publish your content." },
      { name: "Membership Development Lead", description: "Lead the branch's growth strategy. Be responsible for all recruitment and retention efforts. Organize membership drives and ensure a smooth renewal process. Communicate the value of IEEE benefits to prospective members." },
      { name: "Project Coordinator", description: "Lead a specific, long-term technical project (like a robotics build or a software app) from concept to completion. Recruit, organize, and manage the student team working on the project. Coordinate with any outside partners or sponsors for the project." },
      { name: "Link Representative", description: "(Note: This is a specialized role specific to branches within the IEEE Kerala Section) Act as the official communication bridge between our branch and the section-wide IEEE LINK network. Attend all required IEEE LINK meetings. Report our branch's activities to the network and share LINK news with our members." }
    ]
  },
  {
    name: "IEEE PELS SBC JECC (Power Electronics Society Student Branch Chapter)",
    description: "The IEEE PELS SBC JECC is the SBC for the Power Electronics Society (PELS), one of the fastest-growing technical societies within IEEE. Its field of interest involves the \"efficient conversion, control, and condition of electric power\" to promote the sustainable use of energy.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the PELS SBC. Run all official meetings of the PELS SBC and its executive committee. Act as the main contact for faculty, PELS members, and the wider IEEE section. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the PELS SBC's workload. Act as the leader of the PELS SBC in the Chair's absence. Oversee all PELS SBC committees and help manage the year's technical activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the PELS SBC. Maintain all official records and keep detailed minutes of all meetings. Manage all PELS SBC correspondence and meeting notices. Ensure all PELS SBC events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the PELS SBC's finances. Maintain all financial accounts and prepare the annual budget for the PELS SBC. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the PELS SBC Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Event Coordinator", description: "Plan, organize, and manage all PELS-focused technical events, workshops, and seminars. Handle all event logistics, including booking venues, coordinating with speakers, and arranging tech setups. Maintain the PELS SBC's official calendar of events." },
      { name: "Membership Development Lead", description: "Lead the PELS SBC's growth strategy. Organize recruitment drives to encourage students to join the Power Electronics Society. Communicate the specific benefits of PELS membership to prospective members." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the PELS SBC. Manage all of the PELS SBC's social media accounts. Create and share posts to promote PELS events and technical news." }
    ]
  },
  {
    name: "IEEE IAS SBC JECC (Industry Applications Society Student Branch Chapter)",
    description: "The IEEE IAS SBC JECC is the SBC for the Industry Applications Society (IAS). IAS focuses specifically on the \"unique needs of industry and commerce\" and is known for \"bridging theory and practice\" by advancing the application of electrical systems to industrial processes.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the IAS SBC. Run all official meetings of the IAS SBC and its executive committee. Act as the main contact for faculty, IAS members, and industrial partners. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the IAS SBC's workload. Act as the leader of the IAS SBC in the Chair's absence. Oversee all IAS SBC committees and help manage the year's industrial-focused activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the IAS SBC. Maintain all official records and keep detailed minutes of all meetings. Manage all IAS SBC correspondence and meeting notices. Ensure all IAS SBC events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the IAS SBC's finances. Maintain all financial accounts and prepare the annual budget for the IAS SBC. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the IAS SBC Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Event Coordinator", description: "Plan, organize, and manage all IAS-focused events, industry tours, and professional seminars. Handle all event logistics, including booking venues, coordinating with industry speakers, and arranging tech setups. Maintain the IAS SBC's official calendar of events." },
      { name: "Membership Development Lead", description: "Lead the IAS SBC's growth strategy. Organize recruitment drives to encourage students to join the Industry Applications Society. Communicate the specific benefits of IAS membership to prospective members." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the IAS SBC. Manage all of the IAS SBC's social media accounts. Create and share posts to promote IAS events and industry-related news." }
    ]
  },
  {
    name: "IEEE IES SBC JECC (Industrial Electronics Society Student Branch Chapter)",
    description: "The IEEE IES SBC JECC is the SBC for the Industrial Electronics Society (IES). The IES field of interest covers the \"theory and applications of electronics, controls, communications, instrumentation, and computational intelligence to industrial and manufacturing systems and processes\".",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the IES SBC. Run all official meetings of the IES SBC and its executive committee. Act as the main contact for faculty, IES members, and industrial partners. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the IES SBC's workload. Act as the leader of the IES SBC in the Chair's absence. Oversee all IES SBC committees and help manage the year's technical activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the IES SBC. Maintain all official records and keep detailed minutes of all meetings. Manage all IES SBC correspondence and meeting notices. Ensure all IES SBC events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the IES SBC's finances. Maintain all financial accounts and prepare the annual budget for the IES SBC. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the IES SBC Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Membership Development Lead", description: "Lead the IES SBC's growth strategy. Organize recruitment drives to encourage students to join the Industrial Electronics Society. Communicate the specific benefits of IES membership to prospective members." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the IES SBC. Manage all of the IES SBC's social media accounts. Create and share posts to promote IES events and technical news." },
      { name: "Content Lead", description: "Act as the IES SBC's storyteller. Create, write, and edit compelling content for all platforms (website, social media, newsletters). Write content that captures the IES SBC's activities and communicates its value. Collaborate with the Media Lead to publish your content." }
    ]
  },
  {
    name: "IEEE PES SBC JECC (Power & Energy Society Student Branch Chapter)",
    description: "The IEEE PES SBC JECC is the SBC for the Power & Energy Society (PES). As the oldest IEEE society, PES is the \"premier provider of scientific and engineering information on electric power and energy\" and focuses on advancements in energy resources, smart grid, and smart cities.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the PES SBC. Run all official meetings of the PES SBC and its executive committee. Act as the main contact for faculty, PES members, and energy industry professionals. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the PES SBC's workload. Act as the leader of the PES SBC in the Chair's absence. Oversee all PES SBC committees and help manage the year's power and energy activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the PES SBC. Maintain all official records and keep detailed minutes of all meetings. Manage all PES SBC correspondence and meeting notices. Ensure all PES SBC events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the PES SBC's finances. Maintain all financial accounts and prepare the annual budget for the PES SBC. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the PES SBC Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Membership Development Lead", description: "Lead the PES SBC's growth strategy. Organize recruitment drives to encourage students to join the Power & Energy Society. Communicate the specific benefits of PES membership to prospective members." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the PES SBC. Manage all of the PES SBC's social media accounts. Create and share posts to promote PES events and news about the energy sector." },
      { name: "Content Lead", description: "Act as the PES SBC's storyteller. Create, write, and edit compelling content for all platforms (website, social media, newsletters). Write content that captures the PES SBC's activities and communicates its value. Collaborate with the Media Lead to publish your content." }
    ]
  },
  {
    name: "IEEE SPS SBC JECC (Signal Processing Society Student Branch Chapter)",
    description: "The IEEE SPS SBC JECC is the SBC for the Signal Processing Society (SPS). As IEEE's first technical society, SPS is dedicated to \"advancing the field of signal processing,\" the enabling technology for analyzing and interpreting information from signals.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the SPS SBC. Run all official meetings of the SPS SBC and its executive committee. Act as the main contact for faculty, SPS members, and industry professionals. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the SPS SBC's workload. Act as the leader of the SPS SBC in the Chair's absence. Oversee all SPS SBC committees and help manage the year's signal processing activities." },
      { name: "Secretary", description: "Act as the organizational backbone of the SPS SBC. Maintain all official records and keep detailed minutes of all meetings. Manage all SPS SBC correspondence and meeting notices. Ensure all SPS SBC events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the SPS SBC's finances. Maintain all financial accounts and prepare the annual budget for the SPS SBC. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the SPS SBC Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Technical Coordinator", description: "Manage all technology for SPS SBC events, such as A/V, lab equipment, and specialized software. Plan and lead the SPS SBC's technical events, like coding workshops, hackathons, and signal processing seminars. Act as the main technical advisor for the SPS SBC's executive committee." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the SPS SBC. Manage all of the SPS SBC's social media accounts. Create and share posts to promote SPS events and technical news." }
    ]
  },
  {
    name: "IEEE SIGHT AG JECC (Special Interest Group on Humanitarian Technology Affinity Group)",
    description: "The IEEE SIGHT AG JECC is the AG for the Special Interest Group on Humanitarian Technology (SIGHT). This is a network of volunteers dedicated to partnering with underserved communities and local organizations, using technology to solve real-world problems and create a sustainable social impact.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the SIGHT AG. Run all official meetings of the SIGHT AG and its executive committee. Act as the main contact for faculty, SIGHT members, and community partners. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the SIGHT AG's workload. Act as the leader of the SIGHT AG in the Chair's absence. Oversee all SIGHT AG committees and help manage the year's humanitarian projects." },
      { name: "Secretary", description: "Act as the organizational backbone of the SIGHT AG. Maintain all official records and keep detailed minutes of all meetings. Manage all SIGHT AG correspondence and meeting notices. Ensure all SIGHT AG events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the SIGHT AG's finances. Maintain all financial accounts and prepare the annual budget for the SIGHT AG. Oversee all fundraising efforts for humanitarian projects. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the SIGHT AG Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Project Coordinator", description: "Lead a specific, long-term humanitarian or community-based project from concept to completion. Recruit, organize, and manage the student team working on the project. Coordinate with local community partners, NGOs, and sponsors for the project." },
      { name: "Membership Development Lead", description: "Lead the SIGHT AG's growth strategy. Recruit students who are passionate about applying their skills to humanitarian causes. Communicate the value of participating in SIGHT projects." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the SIGHT AG. Manage all of the SIGHT AG's social media accounts. Create and share posts to promote SIGHT projects, highlight community impact, and recruit volunteers." },
      { name: "Content Lead", description: "Act as the SIGHT AG's storyteller. Create, write, and edit compelling content (blogs, reports, posts) about the group's humanitarian projects. Write content that captures the SIGHT AG's impact and communicates its value. Collaborate with the Media Lead to publish your content." }
    ]
  },
  {
    name: "IEEE WIE AG JECC (Women in Engineering Affinity Group)",
    description: "The IEEE WIE AG JECC is the AG for Women in Engineering (WIE). WIE is a global network dedicated to promoting women engineers, technologists, and scientists, and inspiring girls around the world to follow their academic interests in a career in STEM.",
    roles: [
      { name: "Chair", description: "Serve as the primary leader and manager of the WIE AG. Run all official meetings of the WIE AG and its executive committee. Act as the main contact for faculty, WIE members, and professional women in industry. Arrange for the election of new officers annually and report them via vTools Officer Reporting." },
      { name: "Vice Chair", description: "Assist the Chair with all leadership duties and help manage the WIE AG's workload. Act as the leader of the WIE AG in the Chair's absence. Oversee all WIE AG committees and help manage the year's events and mentorship programs." },
      { name: "Secretary", description: "Act as the organizational backbone of the WIE AG. Maintain all official records and keep detailed minutes of all meetings. Manage all WIE AG correspondence and meeting notices. Ensure all WIE AG events are reported through the IEEE vTools platform." },
      { name: "Treasurer", description: "Manage the critical task of the WIE AG's finances. Maintain all financial accounts and prepare the annual budget for the WIE AG. Oversee all fundraising efforts. Manage all payments and reimbursements." },
      { name: "Joint Secretary", description: "Provide direct support to the WIE AG Secretary. Assist in all administrative duties, like taking minutes and managing correspondence. Be prepared to perform the Secretary's functions in their absence." },
      { name: "Technical Coordinator", description: "Manage all technology for WIE AG events, such as A/V for speaker panels or software for workshops. Plan and lead technical workshops and skill-building sessions for members. Act as the main technical advisor for the WIE AG executive committee." },
      { name: "Membership Development Lead", description: "Lead the WIE AG's growth strategy, focusing on recruiting and retaining women in STEM. Organize recruitment drives and promote a supportive community. Communicate the specific benefits of WIE membership to prospective members." },
      { name: "Media Lead", description: "Act as the voice and brand manager of the WIE AG. Manage all of the WIE AG's social media accounts. Create and share posts to promote WIE events, member achievements, and inspiring stories." },
      { name: "Content Lead", description: "Act as the WIE AG's storyteller. Create, write, and edit compelling content profiling women in engineering, promoting events, and highlighting member successes. Write content that captures the WIE AG's activities and communicates its value. Collaborate with the Media Lead to publish your content." }
    ]
  }
];


const departments = [
  'CSE',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'AD',
  'CY',
  'MR',
  // 'RE' removed as requested
];

// --- Roles restricted for First Years ---
const restrictedFirstYearRoles = [
  'Chair',
  'Vice Chair',
  'Secretary',
  'Joint Secretary',
  'Treasurer'
];

// ##################################################################
// #                           COMPONENTS                           #
// ##################################################################

// --- Reusable Header Component ---
const Header = ({ setCurrentPath, currentPath }) => {
  const buttonStyle = "text-lg font-bold text-white bg-blue-700 px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300";
  const navButtonStyle = "text-lg font-bold text-blue-900 px-4 py-2 rounded-lg hover:bg-white/70 transition-all duration-300";

  return (
    <header className="w-full bg-white/50 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/30">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-5">
        <button 
          className="text-xl font-bold text-blue-900"
          onClick={() => setCurrentPath('/')}
        >
          IEEE JECC Execom 2026 Selections
        </button>
        <div className="mt-4 md:mt-0">
          {currentPath === '/' && (
            <button
              onClick={() => setCurrentPath('/apply')}
              className={buttonStyle}
            >
              Apply Now
            </button>
          )}
          {(currentPath === '/apply' || currentPath === '/success') && (
             <button
              onClick={() => setCurrentPath('/')}
              className={navButtonStyle}
            >
              Back to Role Descriptions
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Reusable Footer Component ---
const Footer = () => {
  return (
    <footer className="w-full bg-gray-900/20 backdrop-blur-lg text-gray-700 text-center p-6">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} IEEE JECC. All Rights Reserved.
      </div>
    </footer>
  );
};

// --- Base classes for inputs ---
const inputClasses = (hasError) => 
  `w-full p-3 border rounded-md focus:ring-2 focus:outline-none bg-white/70 backdrop-blur-sm border-gray-300/70 focus:bg-white transition-all duration-300 ${
    hasError ? 'border-red-500 focus:ring-red-500' : 'focus:border-blue-500 focus:ring-blue-500'
  }`;

// --- Reverted select classes to default ---


// --- Reusable Preference Selector Component ---
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
            className={inputClasses(errorSociety)} // Reverted to inputClasses
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
            className={`${inputClasses(errorRole)} disabled:bg-gray-100/70`} // Reverted to inputClasses
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
const ApplicationFormPage = ({ setCurrentPath }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    regNo: '',
    department: '',
    year: '',
    isMember: 'Yes', // --- Default to 'Yes' ---
    membershipId: '',
    pref1_society: '',
    pref1_role: '',
    pref2_society: '',
    pref2_role: '',
    pref3_society: '',
    pref3_role: '',
    whyApply: '',
    prevPosition: 'Yes', // --- Default to 'Yes' ---
    prevPositionDetails: '',
    relevantSkills: '',
    eventsParticipated: '',
    contributionIdeas: '',
    networkingComfort: '',
    commitment: '',
    portfolioLink: '',
    portfolioFile: null,
    declaration: false,
    declaration_first_year_membership: false, 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // --- NEW: Loading state for async validation ---

  const totalSteps = 4;

  // --- Step Validation Functions ---

  const validateStep1 = async () => {
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

    // --- Membership Validation Logic ---
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
    // --- End Logic ---

    // --- NEW: Async Check for Register Number ---
    // Use the already uppercased value from state
    if (!newErrors.regNo && formData.regNo.trim()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('regNo')
          // Use ilike for case-insensitive matching
          .ilike('regNo', formData.regNo.trim()) 
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = 'No rows found' which is good
          throw error;
        }
        
        if (data) {
          newErrors.regNo = 'This register number has already been used to apply.';
        }
      } catch (error) {
        console.error('Error checking register number:', error.message);
        newErrors.regNo = 'Could not verify register number. Please try again.';
      }
    }
    // --- End Async Check ---

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

    // --- Check file size on client side ---
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

      // --- NEW: Force Register Number to Uppercase ---
      if (name === 'regNo') {
        newData[name] = value.toUpperCase();
      }
      // --- End New Logic ---

      // Reset role if the corresponding society changes
      if (name === 'pref1_society') newData.pref1_role = '';
      if (name ==='pref2_society') newData.pref2_role = '';
      if (name === 'pref3_society') newData.pref3_role = '';
      
      // Reset membership ID if user selects "No"
      if (name === 'isMember' && value === 'No') {
        newData.membershipId = '';
      }

      // --- Logic for Year Change ---
      if (name === 'year') {
        // If changing to 2nd/3rd year, set isMember to 'Yes' (implicitly)
        if(value === 'Second' || value === 'Third') {
          newData.isMember = 'Yes';
        }
        // If changing *back* to 1st year from 2nd/3rd, reset to default 'Yes'
        // but allow it to be changed by the user.
        if(value === 'First' && (prevData.year === 'Second' || prevData.year === 'Third')) {
          newData.isMember = 'Yes'; 
        }
      }
      // --- End Logic ---


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

  const nextStep = async () => {
    let stepErrors = {};
    setIsLoading(true);
    setSubmitMessage('Checking...');

    if (currentStep === 1) stepErrors = await validateStep1(); // Now async
    if (currentStep === 2) stepErrors = validateStep2();
    if (currentStep === 3) stepErrors = validateStep3();
    
    setIsLoading(false);
    setSubmitMessage('');
    
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
    setIsLoading(true); // Use isLoading for final submission as well

    // Re-validate all steps just in case
    const step1Errors = await validateStep1(); // Now async
    const step2Errors = validateStep2();
    const step3Errors = validateStep3();
    const step4Errors = validateStep4();

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors, ...step4Errors };
    setErrors(allErrors);
    
    setIsLoading(false);

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

        // --- Client-side file size check just before upload ---
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
      setCurrentPath('/success'); // <-- NEW: Redirect to success page
      window.scrollTo(0, 0);

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
              disabled={isLoading} // --- NEW: Disable button while checking
              className="w-full md:w-auto bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg hover:bg-blue-800 transition duration-300 transform transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
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
            className={inputClasses(errors.department)} // Reverted
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
            className={inputClasses(errors.year)} // Reverted
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
        {/* --- HIGHLIGHTED NOTE --- */}
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
          <FormInput id="contributionIdeas" label="How do you plan to contribute to IEEE JECC as an EXECOM member? Share any new ideas or initiatives you would like to bring forward." error={errors.contributionIdeas}>
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
          Before submitting, please review your responses carefully. By confirming below, you agree to take up responsibilities sincerely and contribute actively to IEEE JECC if selected as part of the EXECOM 2026 team.
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
              I hereby declare that all the information provided above is true to the best of my knowledge. I am willing to actively contribute to IEEE JECC if selected as a member of EXECOM 2026.
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

  return (
    <div className="flex-grow container mx-auto p-4 md:p-12 max-w-5xl">
      <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          IEEE JECC Execom 2026 Selections
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
          {/* Step 5 is handled by redirecting to SuccessPage */}
        </div>

        {/* Render navigation only if not on success step */}
        {currentStep <= totalSteps && (
          <NavigationButtons />
        )}
      </form>
    </div>
  );
};

// ##################################################################
// #                    NEW LANDING/SUCCESS PAGES                   #
// ##################################################################

const LandingPage = ({ setCurrentPath }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // --- NEW: State for modal ---

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-12 max-w-5xl">
      <div className="bg-white/60 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden border border-white/40 animate-fade-in-up">
        {/* Page Header */}
        <div className="p-6 md:p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
            IEEE JECC Execom 2026 Selections
          </h1>
          <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
            Welcome! We are looking for passionate and dedicated individuals to lead the IEEE activities at JECC for the upcoming year. Below you will find the descriptions for all available roles.
          </p>
        </div>

        {/* Apply Now Button (Top) */}
        <div className="p-6 md:p-8 pt-0 flex justify-center">
          <button
            onClick={() => setCurrentPath('/apply')}
            className="text-xl font-bold text-white bg-blue-700 px-10 py-4 rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            Apply Now
          </button>
        </div>

        {/* Role Descriptions Accordion */}
        <div className="p-6 md:p-8 pt-0">
          <h2 className="text-3xl font-bold text-gray-900 pb-3 mb-6 border-b-2 border-blue-300/50 text-center">
            Available Roles & Responsibilities
          </h2>
          <div className="space-y-4">
            {roleDescriptions.map((section, index) => (
              <div key={section.name} className="rounded-xl border border-white/50 bg-white/40 overflow-hidden shadow-md">
                {/* Accordion Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center text-left p-6"
                >
                  <span className="text-xl font-semibold text-blue-800">{section.name}</span>
                  <span className={`transform transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                </button>
                
                {/* Accordion Content */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === index ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {/* --- MODIFIED CONTENT --- */}
                  <div className="p-6 pt-0 space-y-6">
                    <p className="text-gray-700 italic">{section.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Available Roles:</h4>
                      {/* --- NEW: Legend for first years --- */}
                      <p className="text-sm text-gray-600 mb-3">
                        (<span className="text-red-600 font-semibold">*</span>) Not available for First Year students.
                      </p>
                      {/* --- NEW: Two-column grid --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {section.roles.map((role) => (
                          <button
                            key={role.name}
                            onClick={() => setSelectedRole(role)}
                            className="p-3 text-left w-full rounded-lg bg-blue-50/70 hover:bg-blue-100/90 transition-all duration-200"
                          >
                            <span className="font-medium text-blue-800">
                              {role.name}
                              {restrictedFirstYearRoles.includes(role.name) && (
                                <span className="text-red-600 font-semibold ml-1">*</span>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* --- END MODIFIED CONTENT --- */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Now Button (Bottom) */}
        <div className="p-6 md:p-8 pt-6 flex justify-center">
          <button
            onClick={() => setCurrentPath('/apply')}
            className="text-xl font-bold text-white bg-blue-700 px-10 py-4 rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* --- NEW: Render Modal if a role is selected --- */}
      {selectedRole && (
        <RoleDescriptionModal 
          role={selectedRole} 
          onClose={() => setSelectedRole(null)} 
        />
      )}
    </div>
  );
};

// --- NEW: Role Description Modal Component ---
const RoleDescriptionModal = ({ role, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing on click inside
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-900">{role.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-4 overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Responsibilities</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {role.description.split('. ').map((point, i) => point.trim() && (
              <li key={i} className="">
                {point.trim().replace(/,\s*$/, '')}{point.includes('.') ? '' : '.'}
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-700 text-white font-bold py-3 px-10 rounded-md shadow-lg hover:bg-blue-800 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const SuccessPage = ({ setCurrentPath }) => (
  <div className="flex-grow container mx-auto p-4 md:p-12 max-w-5xl">
    <div className="bg-white/60 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden border border-white/40 animate-fade-in-up">
      <div className="animate-fade-in p-10 md:p-16 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          🎉 Thank you for applying for the IEEE Execom 2026!
        </h2>
        <p className="text-lg text-gray-800 mb-4">
          There will be a selection procedure based on the information you've provided and further evaluation rounds.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          From this process, we will finalize the members of the IEEE Execom 2026.
        </p>
        <p className="text-lg text-gray-800 font-semibold mb-8">
          Stay tuned for further updates! 💫
        </p>
        <button
          onClick={() => setCurrentPath('/')}
          className="text-lg font-bold text-white bg-blue-700 px-10 py-4 rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);


// ##################################################################
// #                       MAIN APP COMPONENT                       #
// ##################################################################

function App() {
  // Simple router logic
  const [currentPath, setCurrentPath] = useState('/');

  const renderPage = () => {
    if (currentPath === '/apply') {
      return <ApplicationFormPage setCurrentPath={setCurrentPath} />;
    }
    if (currentPath === '/success') {
      return <SuccessPage setCurrentPath={setCurrentPath} />;
    }
    // Default to the landing page
    return <LandingPage setCurrentPath={setCurrentPath} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 bg-fixed font-inter">
      <Header setCurrentPath={setCurrentPath} currentPath={currentPath} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;