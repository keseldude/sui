// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { type Meta, type StoryObj } from '@storybook/react';

import { CoinsStack, type CoinsStackProps } from '~/ui/CoinsStack';

export default {
    component: CoinsStack,
} as Meta;

export const Default: StoryObj<CoinsStackProps> = {
    args: {
        coinSymbols: ['SUI', 'APC', 'USDC'],
    },
};
