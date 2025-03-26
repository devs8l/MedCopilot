import ReactMarkdown from 'react-markdown';
const formattedResponse = `
### Patient's Primary Health Concern
**Based on the provided medical history, determining the "primary" health concern is subjective and depends on the criteria used for prioritization. However, considering the diagnoses, treatments, and notes from the visits, a summary is provided below.**
- **Patient Name**: Satya
- **Date of Birth**: 1990-05-14
- **Gender**: Male
### Diagnosis Summary
**The patient has been diagnosed with the following conditions across multiple visits:**
- **High Blood Pressure**: Diagnosed on 2024-02-24.
- **Chronic Migraine**: Diagnosed on 2024-02-26.
- **Anxiety Disorder**: Diagnosed on 2024-03-15.
- **Asthma**: Diagnosed on 2024-04-10.
### Analysis and Prioritization
#### Cardiovascular Health
- **High Blood Pressure**: Requires lifestyle modifications (reduced salt intake, regular exercise) and medication (**Amlodipine**). Uncontrolled hypertension can lead to severe cardiovascular complications.
- **Elevated Cholesterol Levels**: Identified in the blood test during the Asthma visit. This further elevates the risk of cardiovascular diseases.
#### Respiratory Health
- **Asthma**: Requires avoiding triggers, using an inhaler, and follow-up lung function tests. Poorly managed asthma can result in acute exacerbations and impact the patient's quality of life.
#### Neurological Health
- **Chronic Migraine**: Requires monitoring stress levels and sleep patterns, and medication (**Sumatriptan**) for pain management. Migraines can significantly affect daily functioning. Mild inflammation was detected during **MRI**.
#### Mental Health
- **Anxiety Disorder**: Requires relaxation techniques, therapy, and potentially medication. Anxiety can impact various aspects of life and co-exist with other conditions.
### Conclusion
BNSDJKbckasefncl
`;
const formattedResponse1 = `
 \n### Patient's Primary Health Concern\n\n**Based on the provided medical history, determining the \"primary\" health concern is subjective and depends on the criteria used for prioritization. However, considering the diagnoses, treatments, and notes from the visits, a summary is provided below.**\n\n- Patient Name: Satya\n- Date of Birth: 1990-05-14\n- Gender: Male\n\n### Diagnosis Summary\n\n**The patient has been diagnosed with the following conditions across multiple visits:**\n\n*   **High Blood Pressure**: Diagnosed on 2024-02-24.\n*   **Chronic Migraine**: Diagnosed on 2024-02-26.\n*   **Anxiety Disorder**: Diagnosed on 2024-03-15.\n*   **Asthma**: Diagnosed on 2024-04-10.\n\n### Analysis and Prioritization\n\n**Considering the potential severity and impact on overall health, the conditions can be prioritized as follows:**\n\n*   **Cardiovascular Health**:\n*   **High Blood Pressure**: Requires lifestyle modifications (reduced salt intake, regular exercise) and medication (**Amlodipine**). Uncontrolled hypertension can lead to severe cardiovascular complications.\n*   **Elevated Cholesterol Levels**: Identified in the blood test during the Asthma visit. This further elevates the risk of cardiovascular diseases.\n*   **Respiratory Health**:\n*   **Asthma**: Requires avoiding triggers, using an inhaler, and follow-up lung function tests. Poorly managed asthma can result in acute exacerbations and impact the patient's quality of life.\n*   **Neurological Health**:\n*   **Chronic Migraine**: Requires monitoring stress levels and sleep patterns, and medication (**Sumatriptan**) for pain management. Migraines can significantly affect daily functioning. Mild Inflammation was detected during **MRI**.\n*   **Mental Health**:\n*   **Anxiety Disorder**: Requires relaxation techniques, therapy, and potentially medication. Anxiety can impact various aspects of life and co-exist with other conditions.\n\n### Conclusion\n\n**While the patient has multiple health concerns, **High Blood Pressure** and **Asthma** are potentially the most critical due to their direct impact on cardiovascular and respiratory systems, respectively. Effective management of these conditions is crucial to prevent complications. The patient's **Chronic Migraine** and **Anxiety Disorder** should also be addressed to improve their overall quality of life. Furthermore, **Elevated cholesterol levels** should be closely monitored and managed, considering its influence on cardiovascular health.**\n
`;
const Error = () => {
  return (
    <section className="overflow-hidden pb-25 pt-45 lg:pb-32.5 lg:pt-50 xl:pb-37.5 xl:pt-55">
      <div className="animate_top mx-auto max-w-[518px] text-center">

        <h2 className="mb-5 text-2xl font-semibold text-black dark:text-white md:text-4xl">
          This Page Does Not Exist
        </h2>
        <p className="mb-7.5">
          The page you were looking for appears to have been moved, deleted or
          does not exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
        >
          Return to Home
          <svg
            className="fill-white"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
              fill=""
            />
          </svg>
        </a>
      </div>
      <div className="max-w-2xl mx-auto mt-10 text-left bg-gray-100 p-5 rounded-md">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-black" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3 text-black" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 text-black" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-lg font-medium mb-2 text-black" {...props} />,
            p: ({node, ...props}) => <p className="mb-3" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold" {...props} />
          }}
        >
          {formattedResponse1}
        </ReactMarkdown>
      </div>
    </section>
  );
};
export default Error;