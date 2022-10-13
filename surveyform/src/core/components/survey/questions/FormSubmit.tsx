/*

1. Receive submitForm callback from SmartForm
2. Call it on click
3. Once form has submitted, redirect to prev/next section

TODO

- Refactor to make DRYer

@see packages/react-ui/components/form/FormSubmit.tsx

*/
import { useVulcanComponents, useFormContext } from "@vulcanjs/react-ui";
import { useRouter } from "next/router.js";
import React, { useState } from "react";
import { getThanksPath } from "~/modules/responses/helpers";
import { getSurveyPath } from "~/modules/surveys/getters";
import { FormattedMessage } from "~/core/components/common/FormattedMessage";
import { SurveyDocument } from "@devographics/core-models";

const FormSubmit = ({
  survey,
  // response,
  sectionNumber,
  nextSection,
  previousSection,
  showMessage = true,
  variant = "bottom",
  readOnly,
  prevLoading,
  setPrevLoading,
  nextLoading,
  setNextLoading,
}: { survey: SurveyDocument } & any) => {
  const formContext = useFormContext();
  const { getDocument, submitForm } = formContext;
  const response = getDocument();

  const router = useRouter();

  const Components = useVulcanComponents();
  return (
    <div className={`form-submit form-section-nav form-section-nav-${variant}`}>
      <div className="form-submit-actions">
        {nextSection ? (
          <Components.LoadingButton
            // title={intl.formatMessage({ id: `sections.${nextSection.id}.title` })}
            className="form-btn-next"
            loading={nextLoading}
            type="submit"
            variant="primary"
            onClick={async (e) => {
              e.preventDefault();
              setNextLoading(true);
              await submitForm();
              setNextLoading(false);
              router.push(
                getSurveyPath({ survey, response, number: sectionNumber + 1 })
              );
            }}
          >
            <span className="sr-only">
              <FormattedMessage id="general.next_section" />
            </span>
            <FormattedMessage
              id={`sections.${nextSection.intlId || nextSection.id}.title`}
            />{" "}
            <span aria-hidden>»</span>
          </Components.LoadingButton>
        ) : readOnly ? null : (
          <Components.LoadingButton
            // title={intl.formatMessage({ id: 'general.finish_survey' })}
            className="form-btn-next form-btn-finish"
            loading={nextLoading}
            type="submit"
            variant="primary"
            onClick={async (e) => {
              e.preventDefault();
              setNextLoading(true);
              await submitForm();
              setNextLoading(false);
              router.push(getThanksPath(response, survey));
            }}
          >
            <FormattedMessage id="general.finish_survey" />
          </Components.LoadingButton>
        )}
        {previousSection ? (
          <Components.LoadingButton
            // title={intl.formatMessage({ id: `sections.${previousSection.id}.title` })}
            className="form-btn-prev"
            loading={prevLoading}
            type="submit"
            variant="primary"
            onClick={async (e) => {
              e.preventDefault();
              setPrevLoading(true);
              await submitForm();
              setPrevLoading(false);
              router.push(
                getSurveyPath({ survey, response, number: sectionNumber - 1 })
              );
            }}
          >
            <span className="sr-only">
              <FormattedMessage id="general.previous_section" />
            </span>
            <span aria-hidden>«</span>{" "}
            <FormattedMessage
              id={`sections.${
                previousSection.intlId || previousSection.id
              }.title`}
            />
          </Components.LoadingButton>
        ) : (
          <div className="prev-placeholder" />
        )}
      </div>

      {showMessage && (
        <div className="form-submit-help">
          <FormattedMessage id="general.data_is_saved" />
        </div>
      )}
    </div>
  );
};

export default FormSubmit;
