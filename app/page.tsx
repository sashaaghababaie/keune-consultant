"use client";

import Button from "./button";
import { Navbar } from "./navbar";
import { Modal, ModalContent, ModalHeader } from "./modal";
import { ResultsModal } from "./result-modal";
import { Slider, SliderState } from "./slider";
import { GrNetwork } from "react-icons/gr";
import { StartModal } from "./start-modal";
import { Pagination } from "./pagination";
import {
  ChangeEvent,
  Children,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";

const initialQuestions: QuestionProps[] = [
  {
    id: "a",
    questionName: "age",
    question: [
      "Please tell us your age.",
      "It'll help us provide the best results.",
    ],
    image: "",
    fields: {
      type: "single",
      options: [
        "Under 18",
        "19-29",
        "30-39",
        "40-49",
        "50+",
        "Prefer not to say",
      ],
    },
  },
  {
    id: "b",
    questionName: "gender",
    question: ["Please choose one that describe you"],
    image: "",
    fields: {
      type: "single",
      options: ["Women", "Men", "Other"],
    },
    condition(answers) {
      const newSlides: string[] = [];

      newSlides.push("b-1");
      if (answers?.includes("Men")) {
        return [{ type: "add", slides: newSlides }];
      } else {
        return [
          {
            type: "remove",
            slides: ["b-1", "n-1", "n-2", "n-3", "n-4", "n-5"],
          },
        ];
      }
    },
  },
  {
    id: "b-1",
    questionName: "need-beard",
    question: [
      "Would you like personalized recommendations for beard care products",
      "based on your beard type and concerns?",
    ],
    image: "",
    fields: {
      type: "single",
      options: ["Yes", "No"],
    },
    condition(answers) {
      if (!answers || !answers.length || answers.includes("No")) {
        return [
          { type: "remove", slides: ["n-1", "n-2", "n-3", "n-4", "n-5"] },
        ];
      } else {
        return [{ type: "add", slides: ["n-1", "n-2", "n-5"] }];
      }
    },
  },
  {
    id: "c",
    questionName: "hair-type",
    question: ["What is your natural hair type?"],
    help: { title: "Help", content: <>Short text</> },
    image: "hair-types.webp",
    fields: {
      type: "single",
      options: ["1", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C"],
    },
  },
  {
    id: "d",
    questionName: "scalp-condition",
    question: ["How would you describe your scalp condition?"],
    help: { title: "Help", content: <>Long text</> },
    image: "",
    fields: {
      type: "single",
      options: ["Oily", "Dry", "Normal (Balanced)", "Mixed/Unusual"],
    },
  },
  {
    id: "e",
    questionName: "scalp-concerns",
    question: ["Do you experience any scalp concerns?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        "Dandruff",
        "Itching",
        "Flaking (dry scalp)",
        "Sensitivity/irritation",
      ],
    },
    condition(answers) {
      const slideParams: { type: "add" | "remove"; slides: string[] }[] = [];

      if (!answers || !answers.length) {
        // return newSlides;
        return [{ type: "remove", slides: ["e-1", "e-2"] }];
      }

      if (
        answers.includes("Dandruff") ||
        answers.includes("Flaking (dry scalp)")
      ) {
        slideParams.push({ type: "add", slides: ["e-1"] });
      }

      if (
        answers.includes("Itching") ||
        answers.includes("Sensitivity/irritation")
      ) {
        slideParams.push({ type: "add", slides: ["e-2"] });
      }

      if (
        !answers.includes("Itching") &&
        !answers.includes("Sensitivity/irritation")
      ) {
        slideParams.push({ type: "remove", slides: ["e-2"] });
      }
      if (
        !answers.includes("Dandruff") &&
        !answers.includes("Flaking (dry scalp)")
      ) {
        slideParams.push({ type: "remove", slides: ["e-1"] });
      }

      return slideParams;
    },
  },
  {
    id: "e-1",
    questionName: "scalp-dandruff-conditions",
    question: ["Can you describe your Dandruff/Flakes?"],

    image: "",
    fields: {
      type: "single",
      options: [
        // "None",
        "Tiny and powdery-like, easily detached from the scalp",
        "Large, Sticked to the scalp, do not detached easily from the scalp",
      ],
    },
  },
  {
    id: "e-2",
    questionName: "scalp-itchiness-conditions",
    question: ["When do your scalps feels itchy or irritated mostly?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        // "None",
        "Before bath, when my scalp is oily.",
        "After Bath, when my scalp is wet",
        "After bath, when my scalp us dry",
      ],
    },
  },
  {
    id: "f",
    questionName: "hair-treatments",
    question: [
      "Have you had any hair treatments such as keratin, protein, or Botox?",
    ],
    help: { title: "Help", content: <>Long text</> },
    image: "",
    fields: {
      type: "single",
      options: [
        "No",
        "Yes, within the last 3 months",
        "Yes, 3-6 months ago",
        "Yes, more than 6 months ago",
      ],
    },
    condition(answers) {
      if (!answers || answers.length === 0) {
        return [{ type: "remove", slides: ["f-1"] }];
      }
      if (answers?.includes("No")) {
        return [{ type: "remove", slides: ["f-1"] }];
      } else {
        return [{ type: "add", slides: ["f-1"] }];
      }
    },
  },
  {
    id: "f-1",
    questionName: "hair-straightening",
    question: ["Do you also perform hair straightening?"],
    image: "",
    fields: {
      type: "single",
      options: ["No", "Yes, Low", "Yes, Medium", "Yes, High"],
    },
  },
  {
    id: "g",
    questionName: "hair-wash",
    question: ["How often do you wash your hair?"],
    image: "",
    fields: {
      type: "single",
      options: [
        "Daily",
        "3-5 times per week",
        "1-2 times per week",
        "Less than once per week",
      ],
    },
  },
  {
    id: "h",
    questionName: "hair-wash-shampoo-type",
    question: [
      "Do you use any Sulfate-Free shampoos in your current wash routines?",
    ],
    image: "",
    fields: {
      type: "single",
      options: ["Yes", "No"],
    },
  },
  {
    id: "i",
    questionName: "heat-styling",
    question: [
      "How often do you use heat styling tools (hair dryer, flat iron)?",
    ],
    image: "",
    fields: {
      type: "single",
      options: [
        "Never",
        "Rarely (1-2 times per month or lesser)",
        "Usually (1-2 times per week)",
        "Frequently (3-5 times per week)",
        "Daily",
      ],
    },
  },
  // {
  //   id: "10",
  //   questionName: "hair-dryer",
  //   question: ["How do you typically use a hair dryer?"],
  //   image: "",
  //   fields: {
  //     type: "single",
  //     options: [
  //       "I don't use a hair dryer",
  //       "Only for gentle drying (low heat)",
  //       "For styling (brushing / shaping)",
  //       "Both drying and styling",
  //     ],
  //   },
  // },
  {
    id: "j",
    questionName: "care-routine",
    question: ["Which products are currently part of your hair care routine?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        "Shampoo",
        "Conditioner",
        "Mask",
        "Leave-in products (serum, oil, cream)",
        "Styling products (gel, wax, spray)",
      ],
    },
  },
  {
    id: "k",
    questionName: "hair-strand-thickness",
    question: ["What is your hair strand thickness?"],
    image: "",
    fields: {
      type: "single",
      options: ["Fine (thin strands)", "Medium", "Thick (coarse strands)"],
    },
  },
  {
    id: "l",
    questionName: "hair-concerns",
    question: ["What hair concerns do you currently have?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        // "None",
        "Hair dryness",
        "Frizz",
        "Breakage",
        "Elasticity",
        "Split ends",
        "Lack of volume",
        "Hair loss / thinning",
        "Greasy hair",
        "Difficulty styling",
      ],
    },
  },
  // {
  //   id: "12",
  //   questionName: "styling-products",
  //   question: ["What styling products do you usually use?"],
  //   sub: "You can choose multiple options or nothing.",
  //   image: "",
  //   fields: {
  //     type: "multi",
  //     options: ["Gel", "Wax / pomade", "Hair spray", "Cream / lotion"],
  //   },
  // },
  {
    id: "m",
    questionName: "styling-products",
    question: ["What are your primary hair styling goals?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        "Increase Volume and Body",
        "Enhance Softness and Smoothness",
        "Add Shine and Radiance",
        "Improve Styling Control and Hold",
        "Maintain a Natural Look and Feel",
      ],
    },
  },
  {
    id: "n-1",
    questionName: "beard-skin-condition",
    question: [
      "How would you describe the condition of the skin beneath your beard?",
    ],
    image: "",
    fields: {
      type: "single",
      options: ["Oily", "Dry", "Normal (Balanced)", "Mixed/Unusual"],
    },
  },

  {
    id: "n-2",
    questionName: "beard-skin-concerns",
    question: [
      "Do you experience any of the following concerns",
      "with the skin beneath your beard?",
    ],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        // "None",
        "Dandruff",
        "Itching",
        "Flaking",
        "Sensitivity/irritation",
      ],
    },
    condition(answers) {
      const slideParams: { type: "add" | "remove"; slides: string[] }[] = [];

      if (!answers || !answers.length) {
        return [{ type: "remove", slides: ["n-3", "n-4"] }];
      }

      if (answers.includes("Dandruff") || answers.includes("Flaking")) {
        slideParams.push({ type: "add", slides: ["n-3"] });
      }

      if (
        answers.includes("Itching") ||
        answers.includes("Sensitivity/irritation")
      ) {
        slideParams.push({ type: "add", slides: ["n-4"] });
      }

      if (
        !answers.includes("Itching") &&
        !answers.includes("Sensitivity/irritation")
      ) {
        slideParams.push({ type: "remove", slides: ["n-4"] });
      }
      if (!answers.includes("Dandruff") && !answers.includes("Flaking")) {
        slideParams.push({ type: "remove", slides: ["n-3"] });
      }

      return slideParams;
    },
  },
  {
    id: "n-3",
    questionName: "beard-dandruff-conditions",
    question: ["Can you describe your Dandruff/Flakes?"],

    image: "",
    fields: {
      type: "single",
      options: [
        // "None",
        "Tiny and powdery-like, easily detached from the skin",
        "Large, Sticked to the skin, do not detached easily from the skin",
      ],
    },
  },
  {
    id: "n-4",
    questionName: "beard-itchiness-conditions",
    question: ["When do your skin feels itchy or irritated mostly?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        // "None",
        "Before bath, when my skin is oily.",
        "After Bath, when my skin skin is wet",
        "After bath, when my skin us dry",
      ],
    },
  },
  {
    id: "n-5",
    questionName: "beard-concerns",
    question: ["What beard hair concerns do you currently have?"],
    sub: "Select all that apply",
    image: "",
    fields: {
      type: "multi",
      options: [
        // "None",
        "Dryness",
        "Frizz",
        "Breakage",
        "Split ends",
        "Lack of volume",
        "Uneven Growth",
        "Difficulty styling",
        "Lack of Softness",
      ],
    },
  },
];

const createEmptyQuestion = (item: (typeof initialQuestions)[number]) => {
  const q = {
    id: item.id,
    name: item.questionName,
    type: item.fields.type,
    question: item.question.join(""),
    answer: null as unknown as string | string[],
  };
  return q;
};

const createEmptyForm = () => {
  const empty = [];

  for (const item of initialQuestions.filter((iq) => !iq.id.includes("-"))) {
    const q = createEmptyQuestion(item);
    empty.push(q);
  }
  return empty;
};

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [swiper, setSwiper] = useState<SliderState | null>(null);
  const [openFirstModal, setOpenFirstModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false);

  const [form, setForm] = useState(createEmptyForm);
  const [questions, setQuestions] = useState(
    initialQuestions.filter((iq) => !iq.id.includes("-")),
  );

  const [currentSlide, setCurrentSlide] = useState(questions?.[0]);

  useEffect(() => {
    if (!openFirstModal) {
      setOpenFirstModal(true);
    }
  }, [setOpenFirstModal]);

  const handleStoreAnswers = (e: ChangeEvent<HTMLInputElement>) => {
    const q = form.find((q) => q.name === e.target.name);
    if (!q) return;
    const { type } = q;
    if (type === "multi") {
      hanldeStoreMultiChoice(e);
    } else if (type === "single") {
      hanldeStoreSingleChoice(e);
    }
  };

  const hanldeStoreMultiChoice = (e: ChangeEvent<HTMLInputElement>) => {
    const updated = structuredClone(form);
    const index = updated.findIndex((q) => q.name === e.target.name);
    const value = e.target.value;
    const current = (updated[index].answer as string[]) || ([] as string[]);

    let newAnswers = [];

    if (current.includes(value)) {
      newAnswers = current.filter((a) => a !== value);
    } else {
      newAnswers = [...current, value];
    }

    updated[index] = { ...updated[index], answer: newAnswers };

    setForm(updated);
  };

  const hanldeStoreSingleChoice = (e: ChangeEvent<HTMLInputElement>) => {
    const updated = structuredClone(form);
    const index = updated.findIndex((q) => q.name === e.target.name);
    updated[index] = { ...updated[index], answer: e.target.value };
    setForm(updated);

    // Only re-evaluate conditions when the user is changing an answer on a
    // slide they already passed (went back). If it's the current or future
    // slide, prepareQuestions handles it on Next press to avoid double-apply.
    const q = questions.find((q) => q.questionName === e.target.name);
    if (!q?.condition) return;

    const qIndex = questions.findIndex((q) => q.questionName === e.target.name);
    const currentIndex = swiper?.current ?? 0;
    if (qIndex >= currentIndex) return;

    const ops = q.condition(e.target.value);
    let _questions = [...questions];
    let _form = updated;

    for (const op of ops) {
      if (op.type === "remove") {
        _questions = _questions.filter((q) => !op.slides.includes(q.id));
        _form = _form.filter((q) => !op.slides.includes(q.id));
      } else {
        for (const slideId of op.slides) {
          if (!_questions.find((q) => q.id === slideId)) {
            const sq = initialQuestions.find((q) => q.id === slideId)!;
            _questions.push(sq);
            _form.push(createEmptyQuestion(sq));
          }
        }
      }
    }

    setQuestions(_questions.sort((a, b) => a.id.localeCompare(b.id)));
    setForm(_form.sort((a, b) => a.id.localeCompare(b.id)));
  };

  const [prepared, setPrepared] = useState(false);

  // Pagination: track visible dots including ones animating out
  const [paginationDots, setPaginationDots] = useState<
    { id: string; exiting: boolean }[]
  >(() => questions.map((q) => ({ id: q.id, exiting: false })));

  useEffect(() => {
    const incoming = questions.map((q) => q.id);
    setPaginationDots((prev) => {
      const prevIds = prev.filter((d) => !d.exiting).map((d) => d.id);
      const added = incoming.filter((id) => !prevIds.includes(id));
      const removed = prevIds.filter((id) => !incoming.includes(id));

      let next = prev.map((d) =>
        removed.includes(d.id) ? { ...d, exiting: true } : d,
      );
      for (const id of added) {
        if (!next.find((d) => d.id === id)) {
          next = [...next, { id, exiting: false }];
        }
      }
      // Sort by id so order matches questions
      return next.sort((a, b) => a.id.localeCompare(b.id));
    });
  }, [questions]);

  useEffect(() => {
    if (prepared) {
      setSlide(swiper!.next);
      setPrepared(false);
    }
  }, [prepared]);

  useEffect(() => {
    if (!swiper) return;
    const { current } = swiper!;
    const found = questions[current];
    setCurrentSlide(found);
  }, [swiper]);

  const resetQuiz = () => {
    const baseQuestions = initialQuestions.filter((iq) => !iq.id.includes("-"));
    setQuestions(baseQuestions);
    setForm(createEmptyForm());
    setSlide(0);
    setCurrentSlide(baseQuestions[0]);
    setOpenResultsModal(false);
  };

  const prepareQuestions = () => {
    const currentId = currentSlide.id;

    if (!currentSlide.condition) {
      const currentIndex = questions.findIndex((q) => q.id === currentId);
      if (currentIndex + 1 >= questions.length) {
        setOpenResultsModal(true);
        return;
      }
      setPrepared(true);
      return;
    }

    const allNewSlides = currentSlide.condition(
      form.find((q) => q.id === currentId)?.answer,
    );

    // Accumulate all add/remove ops on one copy to avoid stale-closure overwrites
    let _questions = [...questions];
    let _form = structuredClone(form);

    for (const op of allNewSlides) {
      if (op.type === "remove") {
        _questions = _questions.filter((q) => !op.slides.includes(q.id));
        _form = _form.filter((q) => !op.slides.includes(q.id));
      } else {
        for (const slideId of op.slides) {
          if (!_questions.find((q) => q.id === slideId)) {
            const q = initialQuestions.find((q) => q.id === slideId)!;
            _questions.push(q);
            _form.push(createEmptyQuestion(q));
          }
        }
      }
    }

    const sortedQuestions = _questions.sort((a, b) => a.id.localeCompare(b.id));
    const sortedForm = _form.sort((a, b) => a.id.localeCompare(b.id));

    const currentIndex = sortedQuestions.findIndex((q) => q.id === currentId);
    setQuestions(sortedQuestions);
    setForm(sortedForm);

    if (currentIndex + 1 >= sortedQuestions.length) {
      setOpenResultsModal(true);
      return;
    }
    setPrepared(true);
  };
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-0 flex flex-col w-full">
        <div className="flex-1 min-h-0">
          <Slider
            timer={0}
            slidePerScreen={1}
            transitionTime={500}
            slideToShow={slide}
            onChange={setSwiper}
            pauseOnHover={false}
          >
            {questions.map((iq) => (
              <Question
                answers={form.find((q) => q.id === iq.id)?.answer || ""}
                key={`question-${iq.id}`}
                {...iq}
                handleInput={handleStoreAnswers}
              />
            ))}
          </Slider>
        </div>
        <div className="px-8 max-w-7xl w-full mx-auto">
          <div className="border-t-2" />
        </div>
        <div className="flex w-full max-w-7xl mx-auto justify-between items-center px-8 sm:px-44 h-20 md:pt-4 pt-0 md:h-36">
          <Button className="font-bold" onClick={() => setSlide(swiper!.prev)}>
            {"<"} Back
          </Button>
          <Pagination
            dots={paginationDots}
            activeIndex={swiper?.current ?? 0}
            onExited={(id) =>
              setPaginationDots((prev) => prev.filter((d) => d.id !== id))
            }
          />
          <Button
            disabled={(() => {
              const found = form.find((q) => q.id === currentSlide.id);

              if (!found) return false;
              if (found.type === "multi") return false;

              if (!found.answer || found.answer.length === 0) return true;
            })()}
            className={`font-bold text-xs sm:text-sm rounded-none ${(swiper?.current ?? 0) === questions.length - 1 ? "bg-black text-white" : ""}`}
            onClick={prepareQuestions}
          >
            {(swiper?.current ?? 0) === questions.length - 1
              ? "RESULTS"
              : "Next >"}
          </Button>
        </div>
        {openFirstModal && (
          <StartModal
            isOpen={openFirstModal}
            onClose={() => setOpenFirstModal(false)}
          />
        )}
        {openResultsModal && (
          <ResultsModal isOpen={openResultsModal} onRetry={resetQuiz} />
        )}
      </main>
    </>
  );
}

interface CheckboxOrRadioProps {
  name: string;
  value: string;
  children: ReactNode;
  className?: string;
  answers: string | string[] | null;
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface Field {
  type: "multi" | "short-text" | "long-text" | "single";
  options?: string[];
}

interface QuestionProps {
  id: string;
  questionName: string;
  help?: { title: string; content: ReactNode };
  sub?: string;
  question: string[];
  image: string;
  fields: Field;
  condition?: (arg?: string | string[]) => {
    type: "add" | "remove";
    slides: string[];
  }[];
}

export function Question({
  id,
  image,
  questionName,
  question,
  sub,
  help,
  fields,
  condition,
  handleInput,
  answers,
}: QuestionProps & {
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
  answers: string | string[] | null;
}) {
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    content: null | ReactNode;
  }>({
    open: false,
    title: "",
    content: null,
  });
  return (
    <div className="h-full gap-6 w-full flex flex-col lg:flex-row max-w-7xl sm:px-12 px-8 m-auto">
      <div className="basis-full min-w-auto lg:min-w-lg flex flex-col justify-center lg:basis-2/5">
        <div className="max-w-sm lg:max-w-xl text-3xl lg:text-4xl ">
          <>
            {question.map((q, i) => (
              <h2 key={`q-sentence-${i}`} className="">
                {q}{" "}
                {condition && i === question.length - 1 && (
                  <GrNetwork className="text-black font-bold inline text-2xl border rounded-full shrink-0 p-1" />
                )}
              </h2>
            ))}
          </>
          {sub && (
            <p className="text-zinc-500 pt-6 font-normal text-sm">{sub}</p>
          )}
          {help && (
            <button
              onClick={() => setModal({ open: true, ...help })}
              className="text-zinc-500 cursor-pointer pt-6 font-normal underline text-xs"
            >
              Need help?
            </button>
          )}
          {/* <div className="lg:hidden block">{image && <img src={image} />}</div> */}
        </div>
      </div>
      <div className="basis-full items-center lg:justify-center lg:basis-3/5 flex flex-col">
        <div className="hidden lg:block">
          {image && <img className="mt-8" src={image} />}
        </div>
        <FieldRenderer
          // key={i}
          answers={answers}
          {...fields}
          questionName={questionName}
          handleInput={handleInput}
        />
        <div className="lg:hidden block">
          {image && <img className="mt-8" src={image} />}
        </div>
      </div>
      {help && modal.open && (
        <HelpModal
          onClose={() => setModal({ open: false, ...help })}
          title={modal.title}
          isOpen={modal.open}
        >
          {help?.content}
        </HelpModal>
      )}
    </div>
  );
}

function HelpModal({
  isOpen,
  title,
  children,
  onClose,
}: {
  onClose: () => void;
  title: string;
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>{title}</ModalHeader>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
export function FieldRenderer(
  props: Field & {
    answers: string | string[] | null;
    questionName: string;
    handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
  },
) {
  if (props.type === "multi") {
    return (
      <CheckboxGrid>
        {props.options?.map((option, i) => (
          <Checkbox
            answers={props.answers}
            value={option}
            key={`option-${i}`}
            name={props.questionName}
            handleInput={props.handleInput}
          >
            {option}
          </Checkbox>
        ))}
      </CheckboxGrid>
    );
  }
  if (props.type === "single") {
    return (
      <RadioGrid>
        {props.options?.map((option, i) => (
          <Radio
            answers={props.answers}
            key={`option-${i}`}
            name={props.questionName}
            value={option}
            handleInput={props.handleInput}
          >
            {option}
          </Radio>
        ))}
      </RadioGrid>
    );
  }
  return <></>;
}

export function Checkbox(props: CheckboxOrRadioProps) {
  return (
    <label
      // htmlFor={props.name} ??
      className={`has-checked:bg-black flex justify-center shrink-0 cursor-pointer text-sm has-checked:text-white px-4 py-2 rounded-full font-bold transition-all border border-black/20 hover:bg-black/10 hover:border-black/30 ${props.className}`}
    >
      {props.children}
      <input
        name={props.name}
        value={props.value}
        checked={props.answers?.includes(props.value)}
        // checked={!!props.value}
        onChange={props.handleInput}
        className="appearance-none"
        type="checkbox"
      />
    </label>
  );
}

function renderRadio(
  className: string,
  index: number,
  props: CheckboxOrRadioProps,
) {
  return <Radio key={`r-${index}`} className={className} {...props} />;
}

function renderCheckbox(
  className: string,
  index: number,
  props: CheckboxOrRadioProps,
) {
  return <Checkbox key={`r-${index}`} className={className} {...props} />;
}

export function Radio(props: CheckboxOrRadioProps) {
  return (
    <label
      // htmlFor={props.name} ??
      className={`has-checked:bg-black flex justify-center shrink-0 cursor-pointer text-sm has-checked:text-white px-4 py-2 rounded-full font-bold transition-all border border-black/20 hover:bg-black/10 hover:border-black/30 ${props.className}`}
    >
      {props.children}
      <input
        name={props.name}
        value={props.value}
        checked={props.answers?.includes(props.value)}
        // checked={state}
        onChange={props.handleInput}
        className="appearance-none"
        type="radio"
      />
    </label>
  );
}

function RadioGrid({ children }: { children: ReactNode }) {
  const childrenArray = Children.toArray(children);

  if (childrenArray.length <= 6) {
    return (
      <div className="flex flex-col  flex-wrap gap-1">
        {childrenArray.map((ch, i) =>
          renderRadio(
            "min-w-64",
            i,
            (ch as ReactElement<CheckboxOrRadioProps>).props,
          ),
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-row  flex-wrap gap-1">
      {childrenArray.map((ch, i) =>
        renderRadio("", i, (ch as ReactElement<CheckboxOrRadioProps>).props),
      )}
    </div>
  );
}

function CheckboxGrid({ children }: { children: ReactNode }) {
  const childrenArray = Children.toArray(children);

  if (childrenArray.length <= 6) {
    return (
      <div className="flex flex-col flex-wrap gap-1">
        {childrenArray.map((ch, i) =>
          renderCheckbox(
            "min-w-64",
            i,
            (ch as ReactElement<CheckboxOrRadioProps>).props,
          ),
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-row  flex-wrap gap-1">
      {childrenArray.map((ch, i) =>
        renderCheckbox("", i, (ch as ReactElement<CheckboxOrRadioProps>).props),
      )}
    </div>
  );
}
