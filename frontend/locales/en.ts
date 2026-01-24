import { Dictionary } from "./tr";

export const en: Dictionary = {
    common: {
        save: "Save",
        saved: "Saved!",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        download: "Download",
        loading: "Loading...",
        noData: "No data found",
        viewAll: "View All",
    },
    sidebar: {
        overview: "Overview",
        applications: "My Applications",
        schedule: "Schedule",
        cvBuilder: "CV Builder",
        settings: "Settings",
        management: "Management",
        adminPanel: "Admin Panel",
        users: "Users",
        messages: "Messages",
        upgradePlan: "Upgrade Plan",
        proVersion: "Get premium tracking features & analytics.",
        proButton: "Pro Version",
    },
    dashboard: {
        welcome: "Welcome",
        summary: "Summary",
        stats: {
            total: "Total Applications",
            responseRate: "Response Rate",
            pending: "Pending",
            interviews: "Interviews",
            rejected: "Rejected",
            offer: "Offer",
            ghosted: "Ghosted",
        },
        charts: {
            statusBreakdown: "Status Breakdown",
            outcomes: "Outcomes",
            upcoming: "Upcoming",
            total: "Total",
            noEvents: "No upcoming events.",
        },
        recentApps: {
            title: "Recent Applications",
            noRecentActivity: "No recent activity. Start applying!",
            addNew: "Add New",
        }
    },
    profile: {
        yourProfile: "Your Profile",
        logout: "Log out",
        signedInAs: "Signed in as",
    },
    notifications: {
        title: "Notifications",
        clearAll: "Clear all",
        allCaughtUp: "All caught up!",
        noNotifications: "No new notifications at the moment. We'll alert you when something happens.",
    },
    cv: {
        preview: "CV Preview",
        builder: "CV Builder",
        title: "CV Title / Name",
        personalInfo: "Personal Info",
        summary: "Professional Summary",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        certificates: "Certificates",
        previewMode: {
            title: "CV Preview",
            subtitle: "This is how your CV data looks.",
            editContent: "Edit Content",
            downloadDocx: "Download .docx",
            noCvFound: "No CV found",
            noCvDesc: "You haven't built your CV yet. Switch to the Open CV Builder tab to create one.",
            openBuilder: "Open CV Builder",
            verify: "Verify",
            degree: "Degree",
            present: "Present"
        },
        sections: {
            experience: {
                title: "Experience",
                add: "Add Position",
                company: "Company Name",
                position: "Position",
                startDate: "Start Date",
                endDate: "End Date",
                current: "I currently work here",
                description: "Description",
                empty: "No experience added yet."
            },
            education: {
                title: "Education",
                add: "Add Education",
                school: "School / University",
                field: "Field of Study",
                degree: "Degree",
                startDate: "Start Date",
                endDate: "End Date",
                empty: "No education added yet."
            },
            skills: {
                title: "Skills",
                add: "Add Skill",
                name: "Skill Name",
                empty: "No skills added."
            },
            languages: {
                title: "Languages",
                add: "Add Language",
                name: "Language (e.g. English)",
                level: "Level",
                levels: {
                    BASIC: "Basic",
                    INTERMEDIATE: "Intermediate",
                    ADVANCED: "Advanced",
                    FLUENT: "Fluent",
                    NATIVE: "Native"
                },
                empty: "No languages added."
            },
            certificates: {
                title: "Certificates & Awards",
                add: "Add Certificate",
                name: "Certificate Name",
                issuer: "Issuing Organization",
                date: "Issue Date",
                url: "Credential URL",
                empty: "No certificates added yet."
            },
            personal: {
                titlePlaceholder: "e.g. Senior Software Engineer CV",
                titleHelp: "This title will appear at the top of your professional profile.",
                summaryPlaceholder: "Write a brief summary of your professional background and key achievements..."
            }
        }
    },
    applications: {
        title: "Applications",
        subtitle: "Manage and track all your opportunities in one place.",
        searchPlaceholder: "Search companies...",
        newButton: "New",
        list: {
            company: "Company",
            position: "Position",
            status: "Status",
            appliedDate: "Applied Date",
            actions: "Actions",
            emptyTitle: "No applications yet",
            emptyDesc: "Start your journey by adding your first job application.",
            emptyAction: "Add Application",
            noResult: "No applications matching \"{query}\" found.",
            loading: "Loading your applications..."
        },
        new: {
            title: "Add New Application",
            companyName: "Company Name",
            companyPlaceholder: "e.g. Google, Stripe",
            position: "Job Position",
            positionPlaceholder: "e.g. Senior Product Designer",
            jobUrl: "Job URL (Optional)",
            jobUrlPlaceholder: "https://...",
            appliedDate: "Applied Date",
            status: "Status",
            notes: "Notes (Optional)",
            notesPlaceholder: "Important details about this job...",
            notesWarning: "Please do not enter sensitive personal data (health, political views, etc.).",
            submit: "Create Application",
            submitting: "Creating...",
            success: "Application created successfully!",
            validation: {
                required: "Company Name and Position are required.",
                genericError: "Something went wrong. Please try again."
            }
        },
        detail: {
            jobDetails: "Job Details",
            visitPost: "Visit Post",
            notes: "Notes",
            notesPlaceholder: "Write your interview notes or thoughts here...",
            saveNotes: "Save Notes",
            saving: "Saving...",
            contacts: "Contacts",
            addContact: "Add Contact",
            noContacts: "No contacts added yet.",
            statusUpdated: "Status updated to ",
            contactAdded: "Contact added successfully!",
            notesSaved: "Notes saved successfully!",
            noLink: "No Link Available",
            delete: "Delete Application",
            contactModal: {
                title: "Add New Contact",
                name: "Name",
                role: "Role / Position",
                email: "Email",
                phone: "Phone",
                linkedin: "LinkedIn",
                save: "Save Contact",
                cancel: "Cancel"
            }
        },
        status: {
            APPLIED: "Applied",
            INTERVIEW: "Interview",
            OFFER: "Offer",
            REJECTED: "Rejected",
            GHOSTED: "Ghosted"
        }
    },
    auth: {
        consent: {
            term1: "I consent to my anonymized data (salary, interview process, etc.) being shared significantly with the community and used for statistical purposes.",
            term2: "I have read and agree to the Terms of Service and Privacy Policy.",
            validation: "You must accept the terms to proceed."
        }
    },
    landing: {
        nav: {
            features: "Features",
            about: "About",
            contact: "Contact",
            login: "Log In",
            signup: "Sign Up",
        },

        hero: {
            badge: "",
            title: "Land Your Dream Job Without the Chaos.",
            subtitle: "Stop using spreadsheets. Track applications, manage interviews, and organize your network in one powerful workspace designed for professionals.",
            getStarted: "Get Started",
            starGithub: "",
        },
        features: {
            title: "Everything You Need",
            subtitle: "Tools designed to streamline your career growth.",
            cards: {
                allInOne: {
                    title: "All in One Place",
                    desc: "Ditch the messy notes. View all your applications, statuses, and notes in a unified dashboard.",
                },
                reminders: {
                    title: "Smart Reminders",
                    desc: "Never miss an interview. Get automated notifications for upcoming calls and follow-ups.",
                },
                analytics: {
                    title: "Pipeline Analytics",
                    desc: "Visualize your progress. See how many applications are sent, interviewed, or offered.",
                }
            }
        },
        about: {
            badge: "Our Mission",
            title: "Empowering Talent to Build Their Future.",
            desc1: "ApplyFollow was born out of frustration. As professionals, we spend so much time adding value to our work, yet we often lack the right tools to manage our own careers.",
            desc2: "Our mission is to eliminate the chaos of job hunting. We believe that with the right data and organization, everyone can land their dream role without the burnout."
        },
        contact: {
            title: "Get in Touch.",
            subtitle: "Have questions or feedback? We'd love to hear from you. Our team is always here to help.",
            info: {
                email: "Email us",
                location: "Location",
            },
            form: {
                name: "Name",
                email: "Email",
                subject: "Subject",
                message: "Message",
                send: "Send Message",
                sending: "Sending...",
            }
        },
        footer: {
            rights: "© 2026 ApplyFollow. Built with ❤️ by Oguzhan.",
            links: {
                terms: "Terms",
            }
        }
    },
    admin: {
        title: "User Management",
        loading: "Loading users...",
        table: {
            fullName: "Full Name",
            email: "Email",
            role: "Role",
            status: "Status",
            actions: "Actions",
            viewDetails: "View Details",
            active: "Active",
            inactive: "Inactive",
        },
        detail: {
            title: "User Details",
            loading: "Loading user details...",
            back: "Back to Users",
            profile: {
                title: "Profile Information",
                fullName: "Full Name",
                email: "Email",
                phone: "Phone",
                address: "Address",
                role: "Role",
                active: "Active",
                links: "Links",
                notProvided: "Not provided"
            },
            stats: {
                title: "User Stats",
                totalApps: "Total Applications",
                hasCv: "Has CV?",
                yes: "YES",
                no: "NO",
                cvScore: "CV Completion"
            },
            tabs: {
                overview: "Overview",
                applications: "Applications",
                cv: "CV / Resume",
            },
            cv: {
                title: "Curriculum Vitae",
                download: "Download Word CV",
                downloading: "Downloading...",
                notCreated: "User has not created a CV yet.",
                phone: "Phone",
                linkedin: "LinkedIn",
                summary: "Professional Summary",
                education: "Education",
                experience: "Experience",
                present: "Present",
            },
            apps: {
                company: "Company",
                position: "Position",
                status: "Status",
                date: "Date Applied",
                empty: "No applications found.",
            }
        }
    },
    calendar: {
        subtitle: "Manage your schedule, interviews, and deadlines.",
        today: "Today",
        monthNames: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        addEvent: "Add Event",
        form: {
            title: "Title",
            titlePlaceholder: "e.g. Google Interview",
            date: "Date",
            time: "Time",
            type: "Type",
            notes: "Notes",
            notesPlaceholder: "Add details, links, or notes...",
            alarm: "Set Alarm / Reminder",
            alarmTime: "Alarm Time",
            save: "Save Event",
            types: {
                event: "event",
                interview: "interview",
                deadline: "deadline"
            }
        },
        toast: {
            success: "Event created successfully!",
            deleted: "\"{title}\" deleted.",
            deleteError: "Could not delete event.",
            fetchError: "Failed to load events.",
            saveError: "Failed to save event."
        },
        confirmDelete: "Are you sure you want to delete this event?"
    },
    profilePage: {
        title: "Profile Settings",
        subtitle: "Manage your personal information and account security.",
        tabs: {
            personal: "Personal Information",
            security: "Security & Password"
        },
        personal: {
            fullName: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            address: "Address",
            summary: "Short Bio / Summary",
            links: "Links",
            linkedin: "LinkedIn URL",
            github: "GitHub URL",
            website: "Personal Website",
            save: "Save Changes",
            saving: "Saving..."
        },
        security: {
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "New Password (Confirm)",
            changePassword: "Change Password",
            changing: "Changing...",
            requirements: "Passwords must be at least 6 characters long."
        },
        toast: {
            profileUpdated: "Profile updated successfully!",
            passwordChanged: "Password changed successfully!",
            matchError: "New passwords do not match.",
            genericError: "Something went wrong. Please try again."
        }
    }
};
