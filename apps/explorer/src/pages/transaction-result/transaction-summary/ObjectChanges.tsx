// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ChevronRight12 } from '@mysten/icons';
import {
    type SuiObjectChangeCreated,
    type SuiObjectChangeMutated,
    type SuiObjectChangeTransferred,
} from '@mysten/sui.js';
import clsx from 'clsx';
import { useState } from 'react';

import { ExpandableList } from '~/ui/ExpandableList';
import { AddressLink, ObjectLink } from '~/ui/InternalLink';
import { Link } from '~/ui/Link';
import { Text } from '~/ui/Text';
import { TransactionCard, TransactionCardSection } from '~/ui/TransactionCard';

enum Labels {
    created = 'Created',
    mutated = 'Updated',
    transferred = 'Transfer',
}

enum ItemLabels {
    package = 'Package',
    module = 'Module',
    function = 'Function',
}

enum LocationIdType {
    AddressOwner = 'AddressOwner',
    ObjectOwner = 'ObjectOwner',
    Shared = 'Shared',
    Unknown = 'Unknown',
}

const contentWrapperClassName = 'max-h-[300px] gap-3';

const DEFAULT_ITEMS_TO_SHOW = 5;

interface ObjectChangeEntryBaseProps {
    type: keyof typeof Labels;
}

function Item({
    label,
    packageId,
    moduleName,
    functionName,
}: {
    label: ItemLabels;
    packageId: string;
    moduleName: string;
    functionName: string;
}) {
    return (
        <div className="flex justify-between gap-10">
            <Text variant="pBody/medium" color="steel-dark">
                {label}
            </Text>

            {label === ItemLabels.package && (
                <ObjectLink objectId={packageId} />
            )}
            {label === ItemLabels.module && (
                <ObjectLink
                    objectId={`${packageId}?module=${moduleName}`}
                    label={moduleName}
                />
            )}
            {label === ItemLabels.function && (
                <Text truncate variant="pBody/medium" color="steel-darker">
                    {functionName}
                </Text>
            )}
        </div>
    );
}

function ObjectDetail({
    objectType,
    objectId,
}: {
    objectType: string;
    objectId: string;
}) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded((prev) => !prev);

    const [packageId, moduleName, functionName] =
        objectType?.split('<')[0]?.split('::') || [];

    const objectDetailLabels = [
        ItemLabels.package,
        ItemLabels.module,
        ItemLabels.function,
    ];

    return (
        <>
            <div className="flex justify-between">
                <Link
                    gap="xs"
                    onClick={toggleExpand}
                    after={
                        <ChevronRight12
                            className={clsx(
                                'h-4 w-4 text-steel-dark',
                                expanded && 'rotate-90'
                            )}
                        />
                    }
                >
                    <Text variant="pBody/medium" color="steel-dark">
                        Object
                    </Text>
                </Link>

                <ObjectLink objectId={objectId} />
            </div>
            {expanded && (
                <div className="mt-2 flex flex-col gap-2">
                    {objectDetailLabels.map((label) => (
                        <Item
                            key={label}
                            label={label}
                            packageId={packageId}
                            moduleName={moduleName}
                            functionName={functionName}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

interface ObjectChangeEntriesProps extends ObjectChangeEntryBaseProps {
    changeEntries: (SuiObjectChangeMutated | SuiObjectChangeCreated)[];
}

function ObjectChangeEntries({
    changeEntries,
    type,
}: ObjectChangeEntriesProps) {
    const title = Labels[type];

    return (
        <TransactionCardSection
            title={
                <Text
                    variant="body/semibold"
                    color={
                        title === Labels.created
                            ? 'success-dark'
                            : 'steel-darker'
                    }
                >
                    {title}
                </Text>
            }
        >
            <ExpandableList
                contentWrapperClassName={contentWrapperClassName}
                items={changeEntries?.map(({ objectType, objectId }) => (
                    <ObjectDetail
                        key={objectId}
                        objectType={objectType}
                        objectId={objectId}
                    />
                ))}
                defaultItemsToShow={DEFAULT_ITEMS_TO_SHOW}
                itemsLabel="Objects"
            />
        </TransactionCardSection>
    );
}

interface ObjectChangeEntryUpdatedProps extends ObjectChangeEntryBaseProps {
    data: Record<
        string,
        SuiObjectChangeMutated[] & { locationIdType: LocationIdType }[]
    >;
}

export function ObjectChangeEntryUpdated({
    data,
    type,
}: ObjectChangeEntryUpdatedProps) {
    if (!data) {
        return null;
    }

    const title = Labels[type];

    const changeObjectEntries = Object.entries(data);

    return (
        <>
            {changeObjectEntries.map(([ownerAddress, changes]) => {
                const locationIdType = changes[0].locationIdType;

                const renderFooter =
                    locationIdType === LocationIdType.AddressOwner ||
                    locationIdType === LocationIdType.ObjectOwner ||
                    locationIdType === LocationIdType.Shared;

                return (
                    <TransactionCard
                        key={ownerAddress}
                        title="Changes"
                        size="sm"
                        shadow
                        footer={
                            renderFooter && (
                                <div className="flex items-center justify-between">
                                    <Text
                                        variant="pBody/medium"
                                        color="steel-dark"
                                    >
                                        Owner
                                    </Text>
                                    {locationIdType ===
                                        LocationIdType.AddressOwner && (
                                        <AddressLink address={ownerAddress} />
                                    )}
                                    {locationIdType ===
                                        LocationIdType.ObjectOwner && (
                                        <ObjectLink objectId={ownerAddress} />
                                    )}
                                    {locationIdType ===
                                        LocationIdType.Shared && (
                                        <ObjectLink
                                            objectId={ownerAddress}
                                            label="Shared"
                                        />
                                    )}
                                </div>
                            )
                        }
                    >
                        <TransactionCardSection
                            title={
                                <Text
                                    variant="body/semibold"
                                    color="steel-darker"
                                >
                                    {title}
                                </Text>
                            }
                        >
                            <ExpandableList
                                contentWrapperClassName={
                                    contentWrapperClassName
                                }
                                items={changes.map(
                                    ({ objectId, objectType }) => (
                                        <ObjectDetail
                                            key={objectId}
                                            objectId={objectId}
                                            objectType={objectType}
                                        />
                                    )
                                )}
                                defaultItemsToShow={DEFAULT_ITEMS_TO_SHOW}
                                itemsLabel="Objects"
                            />
                        </TransactionCardSection>
                    </TransactionCard>
                );
            })}
        </>
    );
}

function groupByOwner(
    objectSummaryChanges: (
        | SuiObjectChangeMutated
        | SuiObjectChangeCreated
        | SuiObjectChangeTransferred
    )[]
) {
    if (!objectSummaryChanges) {
        return {};
    }

    return objectSummaryChanges?.reduce(
        (mapByOwner: Record<string, any[]>, change: any) => {
            const owner = change?.owner;

            let key = '';
            let locationIdType;
            if ('AddressOwner' in owner) {
                key = owner.AddressOwner;
                locationIdType = LocationIdType.AddressOwner;
            } else if ('ObjectOwner' in owner) {
                key = owner.ObjectOwner;
                locationIdType = LocationIdType.ObjectOwner;
            } else if ('Shared' in owner) {
                key = change.objectId;
                locationIdType = LocationIdType.Shared;
            } else {
                const ownerKeys = Object.keys(owner);
                const firstKey = ownerKeys[0];
                key = owner[firstKey];
                locationIdType = LocationIdType.Unknown;
            }

            mapByOwner[key] = mapByOwner[key] || [];
            mapByOwner[key].push({
                ...change,
                locationIdType,
            });

            return mapByOwner;
        },
        {}
    );
}

interface ObjectChangesProps {
    objectSummary: {
        mutated: SuiObjectChangeMutated[];
        created: SuiObjectChangeCreated[];
        transferred: SuiObjectChangeTransferred[];
    };
}

export function ObjectChanges({ objectSummary }: ObjectChangesProps) {
    if (!objectSummary) {
        return null;
    }

    const createdChangesByOwner = groupByOwner(objectSummary?.created);
    const createdChangesData = Object.values(createdChangesByOwner);

    const updatedChangesByOwner = groupByOwner(objectSummary?.mutated);

    const transferredChangesByOwner = groupByOwner(objectSummary?.transferred);

    return (
        <>
            {objectSummary?.created?.length ? (
                <TransactionCard shadow title="Changes" size="sm">
                    {createdChangesData.map((data, index) => (
                        <ObjectChangeEntries
                            key={index}
                            type="created"
                            changeEntries={data}
                        />
                    ))}
                </TransactionCard>
            ) : null}

            {objectSummary.mutated?.length ? (
                <ObjectChangeEntryUpdated
                    type="mutated"
                    data={updatedChangesByOwner}
                />
            ) : null}

            {objectSummary.transferred?.length ? (
                <ObjectChangeEntryUpdated
                    type="transferred"
                    data={transferredChangesByOwner}
                />
            ) : null}
        </>
    );
}
