import React from 'react';
import _ from 'lodash';
import metricsReference from './reference.json';

let k = 0;

class KBLink {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }

    render() {
        return (
            <p key={`kb${k++}`}>For more information, see&nbsp;
            <a target='halindocs' href={this.url}>{this.title}</a></p>
        );
    }
}

const render = lines =>
    <div className='KnowledgeBase'>
        {
            lines.map(l => {
                if (_.isString(l)) {
                    return <p key={`kb${k++}`}>{l}</p>;
                } else if (l instanceof KBLink) {
                    return l.render();
                }

                return l;
            })
        }
    </div>;

const links = {
    configReference: new KBLink('Neo4j Configuration Reference',
        'https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/'),
    txManagement: new KBLink('transaction management', 'https://neo4j.com/docs/java-reference/current/transactions/'),
    connectionManagement: new KBLink('connection management', 'https://neo4j.com/docs/operations-manual/current/monitoring/connection-management/'),
    jmxMonitoring: new KBLink('JMX monitoring of the operating system', 'https://neo4j.com/docs/java-reference/current/jmx-metrics/'),
    usersAndRoles: new KBLink('Native User and role management', 'https://neo4j.com/docs/operations-manual/current/authentication-authorization/native-user-role-management/'),
    understandingDataOnDisk: new KBLink("Understanding Neo4j's Data on Disk",
        'https://neo4j.com/developer/kb/understanding-data-on-disk/'),
    dbStats: new KBLink('db.stats procedures', 'https://neo4j.com/docs/operations-manual/current/reference/procedures/'),
    configuringDataOnDisk: new KBLink('configuration settings reference', 'https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/#config_dbms.directories.data'),
    openFiles: new KBLink('number of open files', 'https://neo4j.com/developer/kb/number-of-open-files/'),
    fsTuning: new KBLink('linux filesystem tuning', 'https://neo4j.com/docs/operations-manual/current/performance/linux-file-system-tuning/'),
    performanceTuning: new KBLink('performance tuning and the page cache', 'https://neo4j.com/developer/guide-performance-tuning/'),
    understandingMemoryConsumption: new KBLink('understanding memory consumption', 'https://neo4j.com/developer/kb/understanding-memory-consumption/'),
    memoryConfiguration: new KBLink('memory configuration and performance', 'https://neo4j.com/docs/operations-manual/3.5/performance/memory-configuration/'),
    tuningGC: new KBLink('memory configuration and performance', 'https://neo4j.com/docs/operations-manual/3.5/performance/memory-configuration/'),
    proceduresAndFunctions: new KBLink('procedures and functions', 'https://neo4j.com/docs/java-reference/current/extending-neo4j/procedures-and-functions/procedures/'),
    troubleshootingConnections: new KBLink('Troubleshooting Bolt Connection Issues', 'https://community.neo4j.com/t/troubleshooting-connection-issues-in-neo4j-browser-and-cypher-shell/129'),
    troubleshootingHalin: new KBLink('Troubleshooting Halin Connection Issues', 'https://community.neo4j.com/t/troubleshooting-connection-issues-with-halin/8413'),
    queryLogging: new KBLink('query logging', 'https://neo4j.com/docs/operations-manual/current/monitoring/logging/query-logging/'),
    logFiles: new KBLink('log file locations', 'https://neo4j.com/docs/operations-manual/current/configuration/file-locations/#file-locations-log-files'),
    systemLoadAverage: new KBLink('JMX system load average', 'https://docs.oracle.com/javase/7/docs/api/java/lang/management/OperatingSystemMXBean.html#getSystemLoadAverage()'),
    systemService: new KBLink('Neo4j as a system service', 'https://neo4j.com/docs/operations-manual/current/installation/linux/systemd/#linux-service-log'),
    authMaxFailedAttempts: new KBLink('Configuring maximum failed authorization attempts', 'https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/#config_dbms.security.auth_max_failed_attempts'),
    enablingCSVMetrics: new KBLink('Enabling CSV Metrics', 'https://neo4j.com/docs/operations-manual/current/monitoring/metrics/expose/#metrics-enable'),
    changingCSVMetricIntervals: new KBLink('Configuring CSV Metrics and sampling intervals', 'https://neo4j.com/docs/operations-manual/current/monitoring/metrics/expose/#metrics-csv'),
    countStore: new KBLink('Fast counts using the count store', 'https://neo4j.com/developer/kb/fast-counts-using-the-count-store/'),
    apocDocs: new KBLink('APOC Documentation', 'https://neo4j.com/docs/labs/apoc/current/'),
    fabric: new KBLink('Fabric', 'https://neo4j.com/docs/operations-manual/4.0/fabric/introduction/'),
};

export default {
    metricsReference,
    links,
    render,
    'neo4j.log': render([
        'The standard log, where general information about Neo4j is written. Not written for Debian and RPM packages. See relevant sections.',
        links.logFiles,
    ]),
    'debug.log': render([
        'Information useful when debugging problems with Neo4j',
        links.logFiles,
    ]),
    'query.log': render([
        'Log of executed queries that takes longer than a specified threshold. (Enterprise Edition only.)',
        links.logFiles,
    ]),
    'security.log': render([
        'Log of security events. (Enterprise Edition only.)',
        links.logFiles,
    ]),
    ApocMetaStats: render([
        'Basic statistics about your database content, that uses the Neo4j Count Store',
        links.apocDocs,
        links.countStore,
    ]),
    LogTroubleshooting: render([
        `Some installs of Neo4j may use journalctl to access logs, which may not be
        on disk in their usual locations.`,
        links.systemService,
        links.queryLogging,
    ]),
    CypherSurface: render([
        'Neo4j has built in procedures and functions which can be called from Cypher',
        `Some are provided for by the system, while others (such as APOC) may be separately
        installed as plugins`,
        links.proceduresAndFunctions,
    ]),
    StoreFiles: render([
        `Store file sizes allow you to track how much disk space Neo4j is using.
         Neo4j uses a file for each kind of information it manages.  Total disk
         space is also impacted by things such as transaction logs.`,
        links.understandingDataOnDisk,
    ]),
    DiskUtilization: render([
        'Shows the breakdown of actual files on disk and how much storage they require',
        links.understandingDataOnDisk,
    ]),
    Neo4jConfiguration: render([
        `The following table displays the contents of the neo4j.conf file, which details
         how the system is configured.`,
        links.configReference,
    ]),
    Roles: render([
        `Roles permit further identifying users and associating them
        with certain permissions.`,
        links.usersAndRoles,
    ]),
    Users: render([
        `User management allows creating new accounts that others can  use
        to access bolt connections in Neo4j.`,
        links.usersAndRoles,
    ]),
    UserManagement: render([
        `Neo4j typically manages users on a per-machine basis.`,
        `Features here will apply changes across all machines in your cluster`,
        `To check if your users and roles are consistent across all of your machines,
        run the advisor in the diagnostics area.`,
        links.usersAndRoles,
    ]),
    SampleQueries: render([
        `Neo4j includes built-in procedures that let us monitor query execution plan and
        execution times for queries that run on the system.`,
        `Halin allows temporary sampling of this data for inspecting what is running on
        the system at any given time.`,
        `All times are given in microseconds (one millionth of a second)`,
        links.dbStats,
    ]),
    Diagnostics: render([
        `This function runs a suite of tests and can provide advice on how
        to improve your configuration.`,
        `A file will be generated with all
        diagnostics, which you can send to Neo4j to help
        troubleshoot issues.`,
    ]),
    Ping: render([
        `Ping sends a trivial cypher query to the server and measures how 
        long it takes the response to come back.`,
        `This is useful when examining slow queries, because it shows
        how much time network latency and basic cypher queries take, allowing
        us to see how much of query performance is those factors, versus the
        execution of the Cypher itself.`,
    ]),
    StorageCapacity: render([
        'Neo4j allows you to configure different directory locations.',
        'Often these will be on the same disk.',
        `The table below shows the underlying disk free and available 
           in each directory specified in your neo4j.conf file.`,
        `If many statistics are the same, this probably means that most 
        or all of your files reside on the same disk.`,
        links.configuringDataOnDisk,
    ]),
    ClusterMember: render([
        'A member is a single machine or container that participates in a Neo4j cluster.',
        'In the case of stand-alone or single instance Neo4j, Halin treats this as a cluster with 1 member.',
    ]),
    ClusterMemory: render([
        'The heap space is used for query execution, transaction state, management of the graph etc. The size needed for the heap is very dependent on the nature of the usage of Neo4j. For example, long-running queries, or very complicated queries, are likely to require a larger heap than simpler queries.',
        'Generally speaking, in order to aid performance, we want to configure a large enough heap to sustain concurrent operations.',
        'In case of performance issues we may have to tune our queries, and monitor their memory usage, in order to determine whether the heap needs to be increased.',
        'The heap memory size is determined by the parameters dbms.memory.heap.initial_size and dbms.memory.heap.max_size. It is recommended to set these two parameters to the same value. This will help avoid unwanted full garbage collection pauses.',
        links.memoryConfiguration,
    ]),
    EventLog: render([
        `Halin keeps a record of all significant events it saw since it connected to
        your Neo4j instance.  This includes leader re-elections, creation of databases,
        users, roles, and so on.`,
        `The event log only pertains to the period of time you're running Halin, because
        halin does not save data locally.`,
    ]),
    GarbageCollection: render([
        'Slow garbage collection is an indication of performance problems.',
        `For best performance,
           you want to make sure the JVM is not spending too much time 
           performing garbage collection. The goal is to have a large 
           enough heap to make sure that heavy/peak load will not result 
           in so called GC-trashing. Performance can drop as much as two orders 
           of magnitude when GC-trashing happens. Having too large heap may 
           also hurt performance so you may have to try some different 
           heap sizes.`,
        links.tuningGC,
    ]),
    FileDescriptors: render([
        `Operating systems place limits on how many files may be open at once.
        In some cases, the usual limits may be too low.`,
        links.openFiles,
        links.fsTuning,
    ]),
    PageCache: render([
        'The page cache is used to cache the Neo4j data as stored on disk. Ensuring that most of the graph data from disk is cached in memory will help avoid costly disk access.',
        links.performanceTuning,
    ]),
    Memory: render([
        'Total memory shows the total amount in use.',
        'Heap – The heap is where your Class instantiations or “Objects” are stored.',
        `Heap is further divided into two categories; the amount used, and the amount committed,
            or in other words how much the database has allocated for potential use.`,
        `The JVM has memory other than the heap, referred to as Non-Heap Memory. 
            It is created at the JVM startup and stores per-class structures such as 
            runtime constant pool, field and method data, and the code for methods and 
            constructors, as well as interned Strings. The default maximum size of 
            non-heap memory is 64 MB. This can be changed using –XX:MaxPermSize VM option.`,
        links.understandingMemoryConsumption,
    ]),
    SystemLoad: render([
        `The system load is a measure of the amount of computational work that a computer system performs.`,
        `System load is the load average for the last minute. 
        The system load average is the sum of the number of runnable entities queued to the 
        available processors and the number of runnable entities running on the available 
        processors averaged over a period of time. The way in which the load average is 
        calculated is operating system specific but is typically a damped 
        time-dependent average. If the load average is not available, a negative 
        value is returned.`,        
        `This method is designed to provide a hint about the system load and may be queried frequently. The load average may be unavailable on some platform where it is expensive to implement this method`,
        `Process load shows how much load is caused by the Neo4j process itself, subject to the same rolling average`,
        links.performanceTuning,
        links.systemLoadAverage,
    ]),
    Privileges: render([
        `Privileges control the access rights to graph elements using a combined 
        whitelist/blacklist mechanism. It is possible to grant access, deny access, 
        or both. The user will be able to access a resource if they have a grant 
        (whitelist) and do not have a deny (blacklist) relevant to that resource. 
        If there are no read privileges provided at all, then the user will be 
        denied access to the entire graph, and this will generate an error. 
        All other combinations of GRANT and DENY will result in the matching 
        subgraph being visible, which will appear to the user as if they have a 
        smaller database (smaller graph).`,
    ]),
    Tasks: render([
        `Neo4j Tasks is a combination of three kinds of information:  connections,
        transactions, and queries.  This allows monitoring of what is currently 
        executing on a given Neo4j cluster member.`,
        links.txManagement,
        links.connectionManagement,
    ]),
    Connections: render([
        `These are bolt or other network connections to the database, showing which 
        programs are accessing the database, and from which network addresses`,
        links.connectionManagement,
    ]),
    Database: render([
        `Databases operate as independent entities in a Neo4j DBMS, both in standalone and in a cluster. 
        Since a cluster consists of multiple independent server instances, the effects of administrative 
        operations like creating a new database happen asynchronously and independently for each server. 
        However, the immediate effect of an administrative operation is to safely commit the desired 
        state in the system database.`,
        `The desired state committed in the system database gets replicated and is picked up by an internal 
        component called the reconciler. It runs on every instance and takes the appropriate actions required 
        locally on that instance for reaching the desired state; creating, starting, stopping and dropping 
        databases.`,        
        `Every database runs in an independent Raft group and since there are two databases in a fresh cluster, 
        system and neo4j, this means that it also has two Raft groups. Every Raft group also has an independent 
        leader and thus a particular Core server could be the leader for one database and a follower for 
        another.`,
    ]),
    Fabric: render([
        `A Fabric setup includes a Fabric database, that acts as the entry point to a federated or sharded graph 
        infrastructure. This database is also referred in Fabric as the virtual database. Drivers and client 
        applications access and use the Fabric database like any other Neo4j database, with the exception that 
        it cannot store any data and queries against it return no data. The Fabric database can be configured 
        only on a standalone Neo4j DBMS, i.e. on a Neo4j DBMS where the configuration setting dbms.mode must 
        be set to SINGLE.`,
        links.fabric,
    ]),
    TransactionsOpen: render([
        'Any query that updates the graph will run in a transaction. An updating query will always either fully succeed, or not succeed at all.',
        `Open transactions are those that are currently in-flight in the database`,
        `Committed transactions have succeeded and finished.`,
        `Rolled back transactions are those that failed, and were not applied.`,
        links.txManagement,
    ]),
    UsedMemory: render([
        `This displays total physical memory / RAM available to the machine that Neo4j runs on.`,
        `This is not limited to what Neo4j uses, but covers all processes running on that machine`,
        links.jmxMonitoring,
    ]),
    Transactions: render([
        `All database operations that access the graph, indexes, or the schema must be performed in a transaction`,
        `Open transactions are the number of active transactions Neo4j is running at any given moment.`,
        `Rolled back transactions are those who have failed, and whose intermediate effects were "rolled back" so that
            the entire transaction as a package either succeeds or fails.`,
        links.txManagement,
    ]),
    FailedToEstablishConnection: render([
        `This error can mean that your database instance is under heavy load or is
            not currently responsive`,
    ]),
    BrokenRoutingTable: render([
        `This error can mean that your cluster routing table in incorrectly specified, or
        that cluster members cannot be contacted within the timeout limit (about 15 seconds)`,
    ]),
    CSVMetrics: render([
        `Metrics are generated by the database and not sampled by Halin in real time.`,
        `In general, these metrics are updated every 3 seconds by the server (default)`,
        `Managing these metrics requires server-side configuration`,
        links.enablingCSVMetrics,
        links.changingCSVMetricIntervals,
    ]),
    BrowserSecurityConstraints: render([
        `This error can mean that you have untrusted SSL certificates on your server.
        Either install trusted certificates, or try again without encryption.`,
        'This error can also mean that you have provided an incorrect DNS name or address for the database',
        'If you are using Neo4j Desktop and running on your local machine, de-select encryption.',
        'Double check your host and try again',
    ]),
    Unauthorized: render([
        'Double check your username and password and try again.',
        `Halin assumes that when you log in as a user, the password for that user is
        the same across all members in the cluster.  Please double check and ensure this
        is the case as well`,
    ]),
    RepeatedAuthFailure: render([
        `This error occurs when the client has tried to log in with the wrong password
        too many times`,
        links.authMaxFailedAttempts,
    ]),
    HalinNotSupported: render([
        `No further information available.`,
    ]),
    UnknownError: render([
        `Unfortunately, no troubleshooting is available for this particular error. 
        Consider checking the Neo4j community site for more information.`
    ]),
    NoActiveDatabase: render([
        'Check to make sure you have activated a database in Neo4j Desktop before launching Halin',
    ]),
    ClusterResponseGraph: render([
        `Each data point represents the timing of a query returned by the Neo4j cluster, showing
        evolving performance over time.`,
        `This is simply used for diagnostic reasons to check if the cluster is responding slowly, or
        if network factors are interfering`,
    ]),
};