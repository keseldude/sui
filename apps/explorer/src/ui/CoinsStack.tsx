// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Sui, Unstaked } from '@mysten/icons';
import clsx from 'clsx';

interface CoinIconProps {
    type: string;
}

function getRenderCoin(type: string) {
    switch (type) {
        case 'SUI':
            return <Sui className="h-2.5 w-2.5" />;
        default:
            return <Unstaked className="h-2.5 w-2.5" />;
    }
}

export function CoinIcon({ type }: CoinIconProps) {
    return (
        <span
            className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-xl text-white',
                type === 'SUI'
                    ? 'bg-sui'
                    : 'bg-gradient-to-r from-gradient-blue-start to-gradient-blue-end'
            )}
        >
            {getRenderCoin(type)}
        </span>
    );
}

export interface CoinsStackProps {
    coinSymbols: string[];
}

export function CoinsStack({ coinSymbols }: CoinsStackProps) {
    return (
        <div className="flex">
            {coinSymbols.map((coinSymbol, index) => (
                <div key={index} className="-ml-1">
                    <CoinIcon type={coinSymbol} />
                </div>
            ))}
        </div>
    );
}
