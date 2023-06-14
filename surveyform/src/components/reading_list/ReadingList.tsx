"use client";
import { useState, useEffect, useRef } from "react";
import { FormattedMessage } from "../common/FormattedMessage";
import { FormInputProps } from "../form/typings";
import {
  EntityWithQuestion,
  getEditionEntities,
  getEditionQuestions,
} from "~/lib/surveys/helpers";
import EntityLabel from "~/components/common/EntityLabel";
import { Button } from "~/components/ui/Button";
import { Cross } from "../icons";
import QuestionLabel from "../form/QuestionLabel";
import {
  Entity,
  QuestionMetadata,
  ResponseDocument,
  SectionMetadata,
} from "@devographics/types";

const cutoff = 5;
const animationDurationInMs = 700;

const useHasChanged = (val: any) => {
  const prevVal = usePrevious(val) as any;
  return prevVal && val && prevVal.toString() !== val.toString();
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const ReadingList = (props: FormInputProps) => {
  const { edition, response, updateCurrentValues } = props;
  const allQuestions = getEditionQuestions(edition);
  const allEntities = getEditionEntities(edition);
  const [showMore, setShowMore] = useState(false);
  const [animate, setAnimate] = useState(false);

  const readingList = response?.readingList || [];
  const hasTooManyItems = readingList.length > cutoff;
  const cutoffReadingList = showMore
    ? readingList
    : readingList.slice(0, cutoff);

  const hasReadingListChanged = useHasChanged(readingList);

  useEffect(() => {
    if (hasReadingListChanged) {
      setAnimate(true);
    }

    const timer = setTimeout(() => {
      setAnimate(false);
    }, animationDurationInMs); // The timeout duration should match the length of your animation

    // Clean up function
    return () => {
      clearTimeout(timer);
    };
  }, [hasReadingListChanged]);

  return (
    <div
      className={`reading-list reading-list-summary ${
        animate ? "reading-list-animate" : ""
      }`}
    >
      <h5 className="reading-list-title">
        <FormattedMessage id="readinglist.title" />
      </h5>
      <div className="reading-list-description">
        <FormattedMessage id="readinglist.description" />
      </div>
      <ul className="reading-list-items">
        {cutoffReadingList.map((itemId) => {
          const entity = allEntities.find((e) => e.id === itemId);
          return entity ? (
            <ListItem
              key={itemId}
              itemId={itemId}
              entity={entity}
              response={response}
              updateCurrentValues={updateCurrentValues}
            />
          ) : null;
        })}
      </ul>
      {hasTooManyItems && (
        <Button
          className="form-show-more"
          onClick={() => {
            setShowMore((showMore) => !showMore);
          }}
        >
          <FormattedMessage
            id={showMore ? "forms.less_options" : "forms.more_options"}
          />
        </Button>
      )}
    </div>
  );
};

const ListItem = ({
  itemId: currentItemId,
  entity,
  response,
  updateCurrentValues,
}: {
  itemId: string;
  entity: EntityWithQuestion;
  response?: ResponseDocument;
  updateCurrentValues: any;
}) => {
  const { question } = entity;
  if (!question) {
    return null;
  }
  const handleClick = () => {
    const readingList = response?.readingList || [];
    updateCurrentValues({
      readingList: readingList.filter((itemId) => itemId !== currentItemId),
    });
  };

  return (
    <li className="reading-list-item">
      {question ? (
        <QuestionLabel section={question.section} question={question} />
      ) : (
        <EntityLabel entity={entity} />
      )}
      <button className="reading-list-item-delete" onClick={handleClick}>
        <Cross />
      </button>
    </li>
  );
};

export default ReadingList;
