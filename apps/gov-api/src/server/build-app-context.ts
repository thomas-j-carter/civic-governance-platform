import { CreateGazetteIssueHandler } from "../application/gazette/create-gazette-issue-handler";
import { GetGazetteIssueHandler } from "../application/gazette/get-gazette-issue-handler";
import { ListGazetteIssuesHandler } from "../application/gazette/list-gazette-issues-handler";
import { PublishGazetteIssueHandler } from "../application/gazette/publish-gazette-issue-handler";
import { AddRecordToGazetteIssueHandler } from "../application/gazette/add-record-to-gazette-issue-handler";
import { ListGazetteEntriesHandler } from "../application/gazette/list-gazette-entries-handler";

gazette: {
        createIssue: new CreateGazetteIssueHandler(
          gazetteIssueRepository,
          auditWriter,
        ),
        getIssue: new GetGazetteIssueHandler(gazetteIssueRepository),
        listIssues: new ListGazetteIssuesHandler(gazetteIssueRepository),
        publishIssue: new PublishGazetteIssueHandler(
          gazetteIssueRepository,
          gazetteEntryRepository,
          auditWriter,
        ),
        createEntry: new CreateGazetteEntryHandler(gazetteEntryRepository),
      },
      gazettePromotion: {
        addRecordToIssue: new AddRecordToGazetteIssueHandler(
          gazetteIssueRepository,
          gazetteEntryRepository,
          officialRecordRepository,
          auditWriter,
        ),
        listEntries: new ListGazetteEntriesHandler(gazetteEntryRepository),
      },
