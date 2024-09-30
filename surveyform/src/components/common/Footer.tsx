"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "~/lib/users/hooks";
import { routes } from "~/lib/routes";
import { LogoutButton } from "~/account/user/components/LogoutButton";
import { DebugZone } from "./DebugZone";
import { publicConfig } from "~/config/public";
import { enableTranslatorMode } from "@devographics/i18n";

import { T, useI18n } from "@devographics/react-i18n";

type LinkItemProps = {
  component?: React.ReactNode;
  showIf?: (args: { currentUser: any }) => boolean;
  id?: string;
  href?: string;
};
const links: Array<LinkItemProps> = [
  {
    component: (
      <span>
        &copy; 2024 <a href="https://swmansion.com/">Software Mansion</a>,
        courtesy of <a href="https://www.devographics.com/">Devographics</a>
      </span>
    ),
  },
  {
    showIf: ({ currentUser }) => !!currentUser,
    id: "nav.account",
    href: routes.account.profile.href,
  },
  {
    showIf: ({ currentUser }) => !currentUser,
    id: "accounts.sign_in",
    href: routes.account.login.href,
  },
  {
    id: "general.privacy_policy",
    href: "https://swmansion.com/privacy/",
  },
  {
    showIf: ({ currentUser }) => !!currentUser,
    component: <LogoutButton asLink={true} />,
  },
];

export const Footer = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-top">
        {links.map((link, index) => (
          <LinkItem key={index} {...link} />
        ))}
      </div>
      {showDebug && <DebugZone />}
    </footer>
  );
};

const LinkWrapper = ({ children }) => (
  <span className="footer-link-item">{children}</span>
);

const LinkItem = ({ id, href, showIf, component }: LinkItemProps) => {
  const { currentUser } = useCurrentUser();
  if (showIf && !showIf({ currentUser })) {
    return null;
  }
  if (component) {
    return <LinkWrapper>{component}</LinkWrapper>;
  }
  if (!(id && href)) {
    throw new Error(
      "id and href are mandatory in LinkItem if 'component' is not set"
    );
  }
  const isOutboundLink = href?.includes("http");

  return (
    <LinkWrapper>
      {isOutboundLink ? (
        <a href={href}>
          <T token={id} fallback={id} />
        </a>
      ) : (
        <Link href={href}>
          <T token={id} fallback={id} />
        </Link>
      )}
    </LinkWrapper>
  );
};
export default Footer;
