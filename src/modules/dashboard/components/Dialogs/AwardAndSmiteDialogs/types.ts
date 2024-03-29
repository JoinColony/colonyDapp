import { WizardDialogType } from '~utils/hooks';
import { DialogProps, ActionDialogProps } from '~core/Dialog';
import { Address } from '~types/index';

export interface ManageReputationDialogFormValues {
  forceAction: boolean;
  domainId: string;
  user: { profile: { walletAddress: Address } };
  amount: number;
  annotation: string;
  motionDomainId: string;
}

export type AwardAndSmiteDialogProps = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    isSmiteAction: boolean;
    ethDomainId?: number;
  };
