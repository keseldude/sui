// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as SuiWordmark } from '../../assets/SuiWordmark.svg';
import NetworkSelect from '../network/Network';
import Search from '../search/Search';

import { LinkWithQuery } from '~/ui/utils/LinkWithQuery';

function Header() {
    return (
        <header className="relative z-20 h-header overflow-visible bg-headerNav">
            <div className="mx-auto flex h-full max-w-[1440px] items-center px-5 2xl:p-0">
                <div className="mr-8 text-white">
                    <LinkWithQuery data-testid="nav-logo-button" to="/">
                        <SuiWordmark className="h-6" />
                    </LinkWithQuery>
                </div>

                <div className="flex-1">
                    <Search />
                </div>

                <div className="ml-2">
                    <NetworkSelect />
                </div>
            </div>
        </header>
    );
}

export default Header;
