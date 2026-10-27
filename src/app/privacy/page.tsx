export const metadata = { title: "Privacy", robots: { index: false, follow: true } };
export default function Privacy() {
  return (
    <article className="container section">
      <h1>
        Your details,
        <br />
        <em>handled with care.</em>
      </h1>
      <p>
        Consultation and contact forms collect the details you provide so the studio can respond to
        your enquiry and manage appointment requests. Appointment records are accessible only to
        authorized studio staff.
      </p>
      <p>
        The website uses essential session cookies for administrator sign-in. Public forms do not
        require a visitor account. A hashed network identifier is used to limit spam.
      </p>
      <p>
        Records are stored with Supabase. If email notifications are enabled, the notification
        provider receives the studio’s email address and a notice of a new request. Films hosted by
        YouTube or Vimeo connect to those providers only when you choose to play them. Preview
        photographs are loaded from Unsplash.
      </p>
      <p>
        Use the contact form to ask about access, correction or deletion of your enquiry. The
        studio’s legal identity, privacy contact, retention period and applicable policy details
        must be finalized before public launch.
      </p>
    </article>
  );
}
