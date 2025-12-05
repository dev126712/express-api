import {client as WorkflowClient} from '@upstash/qstash/workflow/client.js';
import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const qstashClient = new WorkflowClient({
    url: QSTASH_URL,
    token: QSTASH_TOKEN,
});

