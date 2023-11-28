import { Link, useParams } from 'react-router-dom';
import { Container } from '../../components/Container';
import { activityCodeToName, parseActivityCode } from '@wca/helpers';
import { useWcifUtils } from './WCIFProvider';
import { formatDateTimeRange } from '../../lib/utils';

export default function () {
  const { competitionId, roundId } = useParams();
  const { roundActivies } = useWcifUtils();

  const rounds = roundActivies.filter((ra) => ra.activityCode === roundId);
  const groups = rounds.flatMap((r) => r.childActivities);
  const uniqueGroupCodes = [...new Set(groups.map((g) => g.activityCode))];

  return (
    <Container className="">
      <div className="p-2">
        <h3 className="text-2xl">{roundId && activityCodeToName(roundId)}</h3>
      </div>
      <ul className="space-y-2 flex flex-col p-2">
        {[...uniqueGroupCodes.values()].map((value) => {
          const { groupNumber } = parseActivityCode(value);
          const activities = groups.filter((g) => g.activityCode === value);
          const minStartTime = activities.map((a) => a.startTime).sort()[0];
          const maxEndTime = activities.map((a) => a.endTime).sort()[activities.length - 1];

          return (
            <Link
              to={`/competitions/${competitionId!}/events/${roundId}/${groupNumber}`}
              className=" border bg-white list-none rounded-md px-3 py-2 flex cursor-pointer hover:bg-blue-200 group transition-colors flex-row"
              key={value}>
              <li className="flex flex-col">
                <span className="text-xl">Group {groupNumber}</span>
                <span className="text-sm">{formatDateTimeRange(minStartTime, maxEndTime)}</span>
              </li>
            </Link>
          );
        })}
      </ul>
      <div className="p-2">
        <Link
          to={`/competitions/${competitionId}/events/`}
          className="w-full border bg-blue-200 rounded-md p-2 px-1 flex cursor-pointer hover:bg-blue-400 group transition-colors my-1 flex-row">
          Back to Events...
        </Link>
      </div>
    </Container>
  );
}