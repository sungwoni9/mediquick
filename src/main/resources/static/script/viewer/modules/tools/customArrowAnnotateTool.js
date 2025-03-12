import { ArrowAnnotateTool } from '@cornerstonejs/tools';

export class CustomArrowAnnotateTool extends ArrowAnnotateTool {
    constructor(props = {}) {
        super({
            ...props,
            configuration: {
                ...props.configuration,
                getTextCallback: (callback) => {
                    const userInput = prompt('설명을 입력하세요.\nEnter the annotation content:');
                    callback(userInput);
                }
            }
        });
    }
}

CustomArrowAnnotateTool.toolName = 'CustomArrowAnnotateTool';