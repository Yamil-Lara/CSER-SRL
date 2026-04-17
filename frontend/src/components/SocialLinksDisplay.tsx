import React from 'react';
import { FaLinkedin, FaGithub, FaGlobe, FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const LinkedinIcon = FaLinkedin as React.ElementType;
const GithubIcon = FaGithub as React.ElementType;
const GlobeIcon = FaGlobe as React.ElementType;
const FacebookIcon = FaFacebook as React.ElementType;
const InstagramIcon = FaInstagram as React.ElementType;
const TwitterIcon = FaXTwitter as React.ElementType;

interface SocialLinksProps {
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
}

const SocialLinksDisplay: React.FC<SocialLinksProps> = ({ linkedin, github, website, facebook, instagram, twitter }) => {
  if (!linkedin && !github && !website && !facebook && !instagram && !twitter) return null;

  const LinkButton = ({ href, icon: Icon, colorClass, label }: any) => {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-sm text-white hover:opacity-80 hover:scale-105 ${colorClass}`}
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
      </a>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <LinkButton href={linkedin} icon={LinkedinIcon} colorClass="bg-[#0077B5]" label="LinkedIn" />
      <LinkButton href={github} icon={GithubIcon} colorClass="bg-gray-800" label="GitHub" />
      <LinkButton href={twitter} icon={TwitterIcon} colorClass="bg-black" label="X (Twitter)" />
      <LinkButton href={facebook} icon={FacebookIcon} colorClass="bg-[#1877F2]" label="Facebook" />
      <LinkButton href={instagram} icon={InstagramIcon} colorClass="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" label="Instagram" />
      <LinkButton href={website} icon={GlobeIcon} colorClass="bg-green-600" label="Sitio Web" />
    </div>
  );
};

export default SocialLinksDisplay;