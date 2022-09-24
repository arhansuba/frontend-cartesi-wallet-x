// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useState } from "react";
import { useSetChain } from "@web3-onboard/react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";

import config from "./config.json";

const inspecAddress: Record<string, any> = {
    "0x7a69": "http://localhost:5005/inspect", // local hardhat
    "0x13881": "http://localhost:5005/inspect", // polygon_mumbai,
    "0x5": "http://localhost:5005/inspect" // goerli,
};

export const Inspect: React.FC = () => {
    const rollups = useRollups();
    const [{ connectedChain }] = useSetChain();
    const inspectCall = async (str: string) => {
        const payload = str; //ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));

        if (!connectedChain){
            return;
        }
        
        let apiURL= ""

        if(config.inspectAPIURL !== "") {
            apiURL = `${config.inspectAPIURL}/inspect`;
        } else {
            apiURL = inspecAddress[connectedChain.id];
        }

        fetch(`${apiURL}/${payload}`)
            .then(response => response.json())
            .then(data => {
                setReports(data.reports);
                setMetadata({metadata:data.metadata, status: data.status, exception_payload: data.exception_payload});
            });
    };
    const [inspectData, setInspectData] = useState<string>("");
    const [reports, setReports] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<any>({});

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inspectData}
                    onChange={(e) => setInspectData(e.target.value)}
                />
                <button onClick={() => inspectCall(inspectData)} disabled={!rollups}>
                    Send
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Active Epoch Index</th>
                        <th>Curr Input Index</th>
                        <th>Status</th>
                        <th>Exception Payload</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{metadata.metadata ? metadata.metadata.active_epoch_index : ""}</td>
                        <td>{metadata.metadata ? metadata.metadata.current_input_index : ""}</td>
                        <td>{metadata.status}</td>
                        <td>{metadata.exception_payload ? ethers.utils.toUtf8String(metadata.exception_payload): ""}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    {reports.length === 0 && (
                        <tr>
                            <td colSpan={4}>no reports</td>
                        </tr>
                    )}
                    {reports.map((n: any) => (
                        <tr key={`${n.payload}`}>
                            <td>{ethers.utils.toUtf8String(n.payload)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
