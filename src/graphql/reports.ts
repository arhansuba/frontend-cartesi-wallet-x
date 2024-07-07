

import { createClient, defaultExchanges } from "@urql/core";
import fetch from "cross-fetch";
import {
    ReportsDocument,
    ReportsByInputDocument,
    Report,
    Input,
    ReportDocument,
} from "../../generated-src/graphql";

// define PartialReport type only with the desired fields of the full Report defined by the GraphQL schema
export type PartialInput = Pick<Input, "index">;
export type PartialReport = Pick<Report, "__typename" | "index" | "payload"> & {
    input: PartialInput;
};
export type PartialReportEdge = { node: PartialReport };

// define a type predicate to filter out reports
const isPartialReportEdge = (
    n: PartialReportEdge | null
): n is PartialReportEdge => n !== null;

/**
 * Queries a GraphQL server for reports based on input keys
 * @param url URL of the GraphQL server
 * @param input input identification keys
 * @returns List of reports, returned as PartialReport objects
 */
export const getReports = async (
    url: string,
    inputIndex?: number
): Promise<PartialReport[]> => {
    // create GraphQL client to reader server
    const client = createClient({ url, exchanges: defaultExchanges, fetch });

    // query the GraphQL server for reports corresponding to the input index
    console.log(
        `querying ${url} for reports of input index "${inputIndex}"...`
    );

    if (inputIndex !== undefined) {
        // list reports querying by input
        const { data, error } = await client
            .query(ReportsByInputDocument, {
                inputIndex: inputIndex,
            })
            .toPromise();
        if (data?.input?.reports?.edges) {
            return data.input.reports.edges
                .filter<PartialReportEdge>(isPartialReportEdge)
                .map((e) => e.node);
        } else {
            return [];
        }
    } else {
        // list reports using top-level query
        const { data, error } = await client
            .query(ReportsDocument, {})
            .toPromise();
        if (data?.reports) {
            return data.reports.edges
                .filter<PartialReportEdge>(isPartialReportEdge)
                .map((e) => e.node);
        } else {
            return [];
        }
    }
};

/**
 * Queries a GraphQL server looking for a specific report
 * @param url URL of the GraphQL server
 * @param reportIndex report index
 * @param inputIndex input index
 * @returns The corresponding report, returned as a full Report object
 */
export const getReport = async (
    url: string,
    reportIndex: number,
    inputIndex: number
): Promise<Report> => {
    // create GraphQL client to reader server
    const client = createClient({ url, exchanges: defaultExchanges, fetch });

    // query the GraphQL server for the report
    console.log(
        `querying ${url} for report with index "${reportIndex}" from input "${inputIndex}"...`
    );

    const { data, error } = await client
        .query(ReportDocument, { reportIndex, inputIndex })
        .toPromise();

    if (data?.report) {
        return data.report as Report;
    } else {
        throw new Error(error?.message);
    }
};
