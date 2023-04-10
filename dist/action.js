import { getInput, debug, info } from '@actions/core';
import { events } from './events';
import { Config } from './config';
import { IssueForm } from './issue-form';
import { Labeler } from './labeler';
const action = (probot) => {
    probot.on(events.issue, async (context) => {
        const issueFormInput = getInput('issue-form', { required: true });
        const labeler = new Labeler(new IssueForm(JSON.parse(issueFormInput)));
        labeler.config = await Config.getConfig(context);
        // If no config was provided try inputs
        if (!labeler.isConfig) {
            labeler.setInputs({
                section: getInput('section', { required: true }),
                blockList: getInput('block-list').split('\n', 25),
            });
        }
        // Config requires template as well
        labeler.setInputs({
            template: getInput('template'),
        });
        const validationResult = await Labeler.validate(labeler);
        if (validationResult.length > 0) {
            for (const [index, message] of validationResult.entries()) {
                // TODO: Probably needs some care:
                debug(`{ property: ${message.property}, value: ${message.value}, notes: ${message.notes}`);
            }
            return;
        }
        const labels = labeler.gatherLabels();
        // Check if there are some labels to be set
        if (!labels || (Array.isArray(labels) && (labels === null || labels === void 0 ? void 0 : labels.length) < 1)) {
            info('Nothing to do here. CY@');
            return;
        }
        info(`Labels to be set: ${labels}`);
        const response = await context.octokit.rest.issues.addLabels(context.issue({ labels }));
        debug(`GitHub API response status: [${response.status}]`);
    });
};
export default action;
//# sourceMappingURL=action.js.map