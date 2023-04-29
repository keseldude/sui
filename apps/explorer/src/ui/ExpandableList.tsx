// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ChevronRight12 } from '@mysten/icons';
import clsx from 'clsx';
import { type ReactNode, useMemo, useState } from 'react';

import { Link } from './Link';
import { Text } from './Text';

interface ExpandableListProps {
    items: ReactNode[];
    defaultItemsToShow: number;
    itemsLabel?: string;
    contentWrapperClassName?: string;
}

export function ExpandableList({
    items,
    defaultItemsToShow,
    itemsLabel,
    contentWrapperClassName,
}: ExpandableListProps) {
    const [showAll, setShowAll] = useState(false);

    const itemsDisplayed = useMemo(
        () => (showAll ? items : items?.slice(0, defaultItemsToShow)),
        [showAll, items, defaultItemsToShow]
    );

    const handleShowAllClick = () =>
        setShowAll((prevShowAll: boolean) => !prevShowAll);

    let showAllText = '';
    if (showAll) {
        showAllText = 'Show Less';
    } else {
        showAllText = itemsLabel
            ? `Show All ${items.length} ${itemsLabel}`
            : 'Show All';
    }

    const renderItemsDisplayed = itemsDisplayed.map((item, index) => (
        <div key={index}>{item}</div>
    ));

    return (
        <>
            {contentWrapperClassName && items.length > defaultItemsToShow ? (
                <div
                    className={clsx(
                        'flex flex-col overflow-y-auto',
                        contentWrapperClassName
                    )}
                >
                    {renderItemsDisplayed}
                </div>
            ) : (
                renderItemsDisplayed
            )}
            {items.length > defaultItemsToShow && (
                <div className="flex cursor-pointer items-center gap-1 text-steel hover:text-steel-dark">
                    <Link
                        variant="text"
                        onClick={handleShowAllClick}
                        after={
                            <ChevronRight12
                                className={clsx(
                                    'h-3 w-3',
                                    showAll ? 'rotate-90' : ''
                                )}
                            />
                        }
                    >
                        <Text variant="bodySmall/medium">{showAllText}</Text>
                    </Link>
                </div>
            )}
        </>
    );
}
