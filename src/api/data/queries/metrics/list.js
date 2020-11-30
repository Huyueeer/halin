import HalinQuery from '../HalinQuery';
import neo4j from '../../../driver';

export default new HalinQuery({
    description: 'Fetches a list of APOC metrics, if supported',
    // Only supported with very recent versions of APOC
    dependency: ctx => ({
        pass: ctx.supportsMetrics(),
        description: 'Requires CSV Metrics Support (present in recent APOC releases)',
    }),
    query: `
        WITH 'generic' AS variant
        CALL apoc.metrics.list() YIELD name, lastUpdated
        RETURN name, lastUpdated
        ORDER BY lastUpdated ASC;
    `,
    columns: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Last Updated', accessor: 'lastUpdated' },
    ],
    exampleResult: [
        {
            name: "neo4j.bolt.sessions_started",
            lastUpdated: neo4j.int(1551718070000),
        },
        {
            name: "vm.memory.pool.metaspace",
            lastUpdated: neo4j.int(1551718070000),
        },
    ],
});