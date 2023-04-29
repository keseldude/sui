// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
    type BalanceChangeSummary,
    CoinFormat,
    formatBalance,
} from '@mysten/core';
import { Coin } from '@mysten/sui.js';

import { CoinsStack } from '~/ui/CoinsStack';
import { Heading } from '~/ui/Heading';
import { AddressLink } from '~/ui/InternalLink';
import { Text } from '~/ui/Text';
import { TransactionCard, TransactionCardSection } from '~/ui/TransactionCard';

interface BalanceChangesProps {
    changes: BalanceChangeSummary[] | null;
}

function BalanceChangeEntry({ change }: { change: BalanceChangeSummary }) {
    if (!change) {
        return null;
    }

    const { amount, coinType, recipient } = change;
    const isPositive = BigInt(amount) > 0n;

    return (
        <div className="flex flex-col gap-2 py-3 first:pt-0 only:pb-0 only:pt-0">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <Text variant="pBody/medium" color="steel-dark">
                        Amount
                    </Text>
                    <div className="flex">
                        <Text
                            variant="pBody/medium"
                            color={isPositive ? 'success-dark' : 'issue-dark'}
                        >
                            {isPositive ? '+' : ''}
                            {formatBalance(amount, 9, CoinFormat.FULL)}{' '}
                            {Coin.getCoinSymbol(coinType)}
                        </Text>
                    </div>
                </div>

                {recipient && (
                    <div className="flex justify-between">
                        <Text variant="pBody/medium" color="steel-dark">
                            Recipient
                        </Text>
                        {recipient}
                    </div>
                )}
            </div>
        </div>
    );
}

export function BalanceChanges({ changes }: BalanceChangesProps) {
    if (!changes?.length) return null;

    const owner = changes[0]?.owner ?? '';
    const coinsSet = changes.reduce((set, change) => {
        set.add(Coin.getCoinSymbol(change.coinType));
        return set;
    }, new Set<string>());

    return (
        <TransactionCard
            title={
                <div className="flex w-full justify-between">
                    <Heading variant="heading6/semibold" color="steel-darker">
                        Balance Changes
                    </Heading>

                    <CoinsStack coinSymbols={Array.from(coinsSet)} />
                </div>
            }
            shadow
            size="sm"
            footer={
                owner ? (
                    <div className="flex justify-between">
                        <Text variant="pBody/medium" color="steel-dark">
                            Owner
                        </Text>
                        <Text variant="pBody/medium" color="hero-dark">
                            <AddressLink address={owner} />
                        </Text>
                    </div>
                ) : null
            }
        >
            {changes.map((change, index) => (
                <TransactionCardSection key={index}>
                    <BalanceChangeEntry change={change} />
                </TransactionCardSection>
            ))}
        </TransactionCard>
    );
}
