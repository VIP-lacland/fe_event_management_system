import OrganizerHeader from "../Header/OrganizerHeader";


export default function OrganizerLayout({children}) {
    return (
        <>
        <div className="organizer-layout">
            <OrganizerHeader/>
            {children}
        </div>
        </>
    )
}