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
        or: "Or",
        actions: {
            back: "Back",
            save: "Save",
            cancel: "Cancel",
        }
    },
    sidebar: {
        overview: "Overview",
        applications: "Applications",
        schedule: "Schedule",
        cvBuilder: "CV Builder",
        settings: "Settings",
        management: "Management",
        adminPanel: "Admin Panel",
        users: "Users",
        messages: "Messages",
        upgradePlan: "Upgrade Plan",
        proVersion: "Pro Version content...",
        proButton: "Go Pro",
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
        logout: "Logout",
        signedInAs: "Signed in as",
    },
    notifications: {
        title: "Notifications",
        clearAll: "Clear All",
        allCaughtUp: "All caught up!",
        noNotifications: "No new notifications. We'll alert you when something happens.",
    },
    cv: {
        preview: "CV Preview",
        builder: "CV Builder",
        title: "CV Title / Name",
        personalInfo: "Personal Info",
        summary: "Profile Summary",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        certificates: "Certificates",
        previewMode: {
            title: "CV Preview",
            subtitle: "Here's how your CV data looks like.",
            editContent: "Edit Content",
            downloadDocx: "Download .docx",
            noCvFound: "No CV Found",
            noCvDesc: "You haven't created a CV yet. Go to the CV Builder tab to get started.",
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
                empty: "No skills added yet."
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
                empty: "No languages added yet."
            },
            certificates: {
                title: "Certificates & Awards",
                add: "Add Certificate",
                name: "Certificate Name",
                issuer: "Issuing Organization",
                date: "Date Issued",
                url: "Certificate URL",
                empty: "No certificates added yet."
            },
            personal: {
                titlePlaceholder: "e.g. Senior Software Engineer CV",
                titleHelp: "This title will appear at the top of your professional profile.",
                summaryPlaceholder: "Summarize your professional background and key achievements..."
            }
        }
    },
    applications: {
        title: "Applications",
        subtitle: "Manage and track all your opportunities in one place.",
        searchPlaceholder: "Search company...",
        newButton: "Add New",
        list: {
            company: "Company",
            position: "Position",
            status: "Status",
            appliedDate: "Applied Date",
            actions: "Actions",
            emptyTitle: "No applications yet",
            emptyDesc: "Start your journey by adding your first job application.",
            emptyAction: "Add Application",
            noResult: "No applications found matching \"{query}\".",
            loading: "Your applications are loading..."
        },
        new: {
            title: "Add New Application",
            companyName: "Company Name",
            companyPlaceholder: "e.g. Google, Stripe",
            position: "Position",
            positionPlaceholder: "e.g. Senior Product Designer",
            jobUrl: "Job URL (Optional)",
            jobUrlPlaceholder: "https://...",
            appliedDate: "Applied Date",
            status: "Status",
            notes: "Notes (Optional)",
            notesPlaceholder: "Important details about this job...",
            notesWarning: "Please do not enter sensitive personal data such as health data, political opinions, etc.",
            submit: "Save Application",
            submitting: "Saving...",
            success: "Application created successfully!",
            validation: {
                required: "Company Name and Position are required fields.",
                genericError: "Something went wrong. Please try again."
            }
        },
        detail: {
            jobDetails: "Job Details",
            visitPost: "Visit Post",
            notes: "Notes",
            notesPlaceholder: "Write down interview notes or thoughts here...",
            saveNotes: "Save Notes",
            saving: "Saving...",
            contacts: "Contacts",
            addContact: "Add Contact",
            noContacts: "No contacts added yet.",
            statusUpdated: "Status updated to: ",
            contactAdded: "Contact added successfully!",
            notesSaved: "Notes saved!",
            noLink: "No Link",
            delete: "Delete Application",
            contactModal: {
                title: "Add New Contact",
                name: "Name",
                role: "Role / Position",
                email: "Email",
                phone: "Phone",
                linkedin: "LinkedIn",
                save: "Save",
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
            term1: "I consent to my anonymized data (salary, interview process, etc.) being shared with the community and used for statistical purposes.",
            term2: "I have read and agree to the User Agreement and Privacy Policy.",
            validation: "You must accept the terms to continue."
        },
        login: {
            title: "Sign In",
            subtitle: "Enter your credentials to access your dashboard.",
            submit: "Sign In",
            forgotPassword: "Forgot Password?",
            noAccount: "Don't have an account?",
            createAccount: "Sign Up",
        },
        register: {
            title: "Sign Up",
            subtitle: "Start tracking your job applications today.",
            submit: "Create Account",
            alreadyHaveAccount: "Already have an account?",
            fullName: "FULL NAME",
            email: "EMAIL",
            password: "PASSWORD",
        }
    },
    landing: {
        nav: {
            features: "Features",
            howItWorks: "How It Works",
            about: "About",
            contact: "Contact",
            login: "Login",
            signup: "Sign Up",
        },

        hero: {
            badge: "Next-Gen Career Management",
            title: "End the Chaos, Take Control of Your Career Journey.",
            subtitle: "Ditch the messy spreadsheets. Organize applications, schedule interviews, and pave your way to success with a professional workspace.",
            getStarted: "Get Started Now",
            starGithub: "Star on GitHub",
        },
        features: {
            title: "Everything You Need",
            subtitle: "Tools designed to optimize your career growth.",
            cards: {
                allInOne: {
                    title: "All-in-One Dashboard",
                    desc: "Escape the scattered notes. Manage all your applications, statuses, and custom notes in one unified view.",
                },
                reminders: {
                    title: "Interview Tracking",
                    desc: "Never miss a meeting. Track your upcoming interviews on the calendar and organize your schedule.",
                },
                analytics: {
                    title: "Success Analytics",
                    desc: "Monitor your journey with data. Analyze application trends and success rates through visual charts.",
                },
                cvBuilder: {
                    title: "Professional CV Builder",
                    desc: "Generate professional resumes in Word (docx) format instantly using your profile data.",
                }
            }
        },
        howItWorks: {
            title: "How It Works",
            subtitle: "Optimize your career journey in 6 simple steps.",
            steps: {
                step1: { title: "Sign Up", desc: "Create your account quickly or login with one click via Google/GitHub." },
                step2: { title: "Add Applications", desc: "Save job listings in seconds, organize links and company details." },
                step3: { title: "Create CV", desc: "Generate professional Word resumes instantly using your data." },
                step4: { title: "Manage Network", desc: "Track key contacts and recruiter notes for every application." },
                step5: { title: "Calendar & Alarms", desc: "Never miss an interview with custom alarms and reminders." },
                step6: { title: "Analyze Progress", desc: "Monitor success rates and optimize your path with visual charts." }
            }
        },
        about: {
            badge: "Our Mission",
            title: "Empowering Professionals to Build Their Future.",
            desc1: "ApplyFollow was born from a need. As professionals, we focus on adding value to our work, but we lack the right tools to manage our own career paths.",
            desc2: "Our mission is to eliminate the chaos in the job search process. We believe that with the right data and organization, anyone can reach their dream job without burnout."
        },
        testimonials: {
            title: "User Testimonials",
            quotes: [
                { text: "With ApplyFollow, I could manage 20 applications at once without feeling overwhelmed. A real lifesaver.", author: "Ece Y., Senior Developer" },
                { text: "Quitting spreadsheets was the best decision I ever made. Visual tracking is incredibly convenient.", author: "Can B., Product Manager" }
            ]
        },
        faq: {
            title: "Frequently Asked Questions",
            items: [
                { q: "Is it free?", a: "Our basic features will always remain free. Professional tools are coming soon." },
                { q: "Is my data safe?", a: "Your security is our priority. Your data is protected with industry-standard encryption." }
            ]
        },
        contact: {
            title: "Get in Touch.",
            subtitle: "Have questions or feedback? We'd love to hear from you. Our team is always ready to help.",
            info: {
                email: "Send an email",
                location: "Location",
            },
            form: {
                name: "Name",
                email: "Email",
                subject: "Subject",
                message: "Your message",
                send: "Send Message",
                sending: "Sending...",
            }
        },
        footer: {
            rights: "© 2026 ApplyFollow. Made with ❤️ by Oguzhan.",
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
                active: "Status",
                links: "Links",
                notProvided: "Not Provided"
            },
            stats: {
                title: "Statistics",
                totalApps: "Total Applications",
                hasCv: "Has CV?",
                yes: "YES",
                no: "NO",
                cvScore: "CV Completion Score"
            },
            tabs: {
                overview: "Overview",
                applications: "Applications",
                cv: "CV / Resume",
            },
            cv: {
                title: "CV / Resume",
                download: "Download Word CV",
                downloading: "Downloading...",
                notCreated: "User hasn't created a CV yet.",
                phone: "Phone",
                linkedin: "LinkedIn",
                summary: "Profile Summary",
                education: "Education",
                experience: "Experience",
                present: "Present",
            },
            apps: {
                company: "Company",
                position: "Position",
                status: "Status",
                date: "Applied Date",
                empty: "No applications found.",
            }
        }
    },
    calendar: {
        subtitle: "Manage your schedule, interviews and deadlines.",
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
            notesPlaceholder: "Add details, links or notes...",
            alarm: "Set Alarm / Reminder",
            alarmTime: "Alarm Time",
            save: "Save",
            types: {
                event: "Event",
                interview: "Interview",
                deadline: "Deadline"
            }
        },
        toast: {
            success: "Event created successfully!",
            deleted: "\"{title}\" deleted.",
            deleteError: "Could not delete event.",
            fetchError: "Could not load events.",
            saveError: "Could not save event."
        },
        confirmDelete: "Are you sure you want to delete this event?"
    },
    profilePage: {
        title: "Profile Settings",
        subtitle: "Manage your personal information and account security.",
        tabs: {
            personal: "Personal Info",
            security: "Security & Password"
        },
        personal: {
            fullName: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            address: "Address",
            summary: "Brief Bio / Summary",
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
            genericError: "An error occurred. Please try again."
        }
    }
};
