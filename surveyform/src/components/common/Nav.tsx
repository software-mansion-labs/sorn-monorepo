"use client";
import React from "react";
import LocaleSwitcher from "./LocaleSwitcher";
import Link from "next/link";
import { routes } from "~/lib/routes";
import { EditionMetadata } from "@devographics/types";
import { getEditionHomePath } from "~/lib/surveys/helpers/getEditionHomePath";

import { T, useI18n } from "@devographics/react-i18n";

const Navigation = ({ edition }: { edition?: EditionMetadata }) => {
  return (
    <div className="nav-wrapper">
      <div className="nav-surveys">
        <Link className="nav-surveys-link" href={"/"}>
          {/* TODO: replace with smaller image */}
          <img
            width={30}
            height={30}
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/surveys/state-of-react-native-logo.png`}
            alt={`logo`}
          />
          State of React Native
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
