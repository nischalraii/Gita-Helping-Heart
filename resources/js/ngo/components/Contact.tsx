import { useForm } from "@inertiajs/react";
import React from "react";
import EnquiryController from "@/actions/App/Http/Controllers/EnquiryController";
import InputError from "@/components/input-error";
import siteData from "../data/site.json";
import type { SiteSettings } from "../data/siteData";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

const emptyEnquiry = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  location: "",
  message: "",
  website: "",
};

export function Contact({ settings }: { settings: SiteSettings }) {
  const form = useForm(emptyEnquiry);

  const bind = (field: keyof typeof emptyEnquiry) => ({
    value: form.data[field],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => form.setData(field, e.target.value),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.post(EnquiryController.store.url(), {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  return (
    <section id="contact">
      <div className="wrap contact-grid">
        <div className="contact-card reveal">
          <div className="eyebrow">Contact</div>
          <h2>{siteData.name}</h2>
          <ul className="contact-list">
            <li>
              <span className="ci"><PinIcon /></span>
              <div>
                <strong>Address</strong>
                <p>{settings.address}</p>
              </div>
            </li>
            <li>
              <span className="ci"><MailIcon /></span>
              <div>
                <strong>Email</strong>
                <p>{settings.email}</p>
              </div>
            </li>
            {settings.phone && (
              <li>
                <span className="ci"><PhoneIcon /></span>
                <div>
                  <strong>Phone</strong>
                  <p>{settings.phone}</p>
                </div>
              </li>
            )}
          </ul>

          {settings.map_embed_url && (
            <div className="map-embed">
              <iframe
                src={settings.map_embed_url}
                title="Our location on the map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="form-card reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
          <div className="section-head">
            <h2>Send an Enquiry</h2>
            <p>Tell us how we can help and we will respond as soon as we can.</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <input placeholder="Your name" {...bind("name")} />
              <InputError message={form.errors.name} />
            </div>
            <div className="field">
              <input type="email" placeholder="Email" {...bind("email")} />
              <InputError message={form.errors.email} />
            </div>
            <div className="field">
              <input placeholder="Phone (optional)" {...bind("phone")} />
              <InputError message={form.errors.phone} />
            </div>
            <div className="field">
              <input placeholder="Subject" {...bind("subject")} />
              <InputError message={form.errors.subject} />
            </div>
            <div className="field">
              <input placeholder="Location (optional)" {...bind("location")} />
              <InputError message={form.errors.location} />
            </div>
            <div className="field full">
              <textarea placeholder="How can we help?" {...bind("message")} />
              <InputError message={form.errors.message} />
            </div>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <input
              className="hp-field"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              {...bind("website")}
            />

            <button className="btn" type="submit" disabled={form.processing}>
              {form.processing ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
