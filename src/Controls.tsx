/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import {
    faTh,
    faList,
    faCircle,
    faUpload,
    faThLarge,
    faFolderPlus,
    faCheckCircle,
    // faArrowLeft as iconPathBack,
    // faArrowRight as iconPathForward,
    faLevelUpAlt as iconPathParentDir,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {faFolder} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import DropdownButton from './DropdownButton';
import {FileData, FolderView, Option, Options} from './typedef';

type ControlsProps = {
    folderChain?: (FileData | null)[];

    onFileOpen?: (file: FileData) => void;

    view: FolderView;
    setView: (view: FolderView) => void;
    options: Options;
    setOption: (name: Option, value: boolean) => void;
};

type ControlsState = {};

const ViewControls = [
    [faList, FolderView.Details, 'Details'],
    [faTh, FolderView.SmallThumbs, 'Small thumbnails'],
    [faThLarge, FolderView.LargeThumbs, 'Large thumbnails'],
];

const DropdownButtons = [
    [Option.ShowHidden, 'Show hidden files'],
    [Option.FoldersFirst, 'Show folders first'],
    [Option.ConfirmDeletions, 'Confirm before deleting'],
    [Option.DisableSelection, 'Disable text selection'],
];

export default class Controls extends React.Component<ControlsProps, ControlsState> {

    static defaultProps = {};


    constructor(props: ControlsProps) {
        super(props);
    }

    renderFolderChain() {
        const {folderChain, onFileOpen} = this.props;
        if (!folderChain) return null;

        const comps = new Array(folderChain.length * 2 - 1);
        for (let i = 0; i < folderChain.length; ++i) {
            const folder = folderChain[i];
            const isLast = i === folderChain.length - 1;
            const j = i * 2;

            const compProps: any = {
                key: `folder-chain-entry-${j}`,
                className: classnames({
                    'chonky-folder-chain-entry': true,
                    'chonky-loading': !folder,
                }),
            };
            if (folder && onFileOpen && !isLast) compProps.onClick = () => onFileOpen(folder);

            const TagToUse = compProps.onClick ? 'button' : 'div';
            comps[j] = <TagToUse {...compProps} >
                {j === 0 && <span className="chonky-text-subtle-dark">
                    <FontAwesomeIcon icon={faFolder}/>&nbsp;&nbsp;
                </span>}
                <span className="chonky-folder-chain-entry-name">{folder ? folder.name : 'Loading...'}</span>
            </TagToUse>;
            if (!isLast) {
                comps[j + 1] = <div key={`folder-chain-separator-${j}`} className="chonky-folder-chain-separator">
                    <FontAwesomeIcon icon={faChevronRight} size="sm"/>
                </div>;
            }
        }

        return <div className="chonky-folder-chain">{comps}</div>;
    }

    renderViewControls() {
        const {view, setView} = this.props;
        let i = 0;
        const comps = new Array(ViewControls.length);
        for (const [icon, buttonView, tooltip] of ViewControls) {
            comps[i++] = <IconButton key={`control-${buttonView}`} icon={icon} active={view === buttonView}
                                     tooltip={tooltip as string} onClick={() => setView(buttonView as FolderView)}/>;
        }
        return <ButtonGroup>{comps}</ButtonGroup>;
    }

    renderOptionsDropdown() {
        const {options, setOption} = this.props;
        const comps = new Array(DropdownButtons.length);
        let i = 0;
        for (const [optionName, text] of DropdownButtons) {
            const value = options[optionName];
            comps[i++] = <DropdownButton key={`option-${optionName}`}
                                         icon={faCheckCircle} altIcon={faCircle} active={options[optionName]}
                                         text={text} onClick={() => setOption(optionName as Option, !value)}/>;
        }
        return <Dropdown title="Options">{comps}</Dropdown>;
    }

    render() {
        const {folderChain, onFileOpen} = this.props;
        const parentDirButtonProps: any = {};
        if (onFileOpen && folderChain && folderChain.length > 1) {
            const parentFolder = folderChain[folderChain.length - 2];
            if (parentFolder) parentDirButtonProps.onClick = () => onFileOpen(parentFolder);
        }

        return <div className="chonky-controls">
            <div className="chonky-side chonky-side-left">
                <ButtonGroup>
                    {/*<IconButton icon={iconPathBack}/>*/}
                    {/*<IconButton icon={iconPathForward}/>*/}
                    <IconButton icon={iconPathParentDir} {...parentDirButtonProps}/>
                </ButtonGroup>
                {this.renderFolderChain()}
            </div>
            <div className="chonky-side chonky-side-right">
                <IconButton icon={faFolderPlus} tooltip="Create folder"/>
                <IconButton icon={faUpload} tooltip="Upload files"/>
                {this.renderViewControls()}
                {this.renderOptionsDropdown()}
            </div>
        </div>;
    }

}
