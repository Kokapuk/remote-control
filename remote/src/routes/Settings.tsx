import useSettingsStore from '@/stores/settings';
import { Slider } from '@/ui/slider';
import { toaster } from '@/ui/toaster';
import { Button, Card, Field, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

export default function Settings() {
  const navigate = useNavigate();

  const { moveSensitivity, scrollSensitivity, accelerationThreshold, maxAccelerationFactor, setSettings } =
    useSettingsStore(
      useShallow((s) => ({
        moveSensitivity: s.moveSensitivity,
        scrollSensitivity: s.scrollSensitivity,
        accelerationThreshold: s.accelerationThreshold,
        maxAccelerationFactor: s.maxAccelerationFactor,
        setSettings: s.setSettings,
      }))
    );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formdata = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSettings({
      moveSensitivity: +formdata.moveSensitivity,
      scrollSensitivity: +formdata.scrollSensitivity,
      accelerationThreshold: +formdata.accelerationThreshold,
      maxAccelerationFactor: +formdata.maxAccelerationFactor,
    });
    toaster.success({ title: 'Saved' });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Card.Root as="form" maxW="sm" marginInline="auto" onSubmit={handleSubmit as any}>
      <Card.Header>
        <Card.Title>Settings</Card.Title>
      </Card.Header>

      <Card.Body>
        <Stack gap="8">
          <Field.Root>
            <Slider
              defaultValue={[moveSensitivity]}
              min={0.01}
              step={0.01}
              max={5}
              showValue
              name="moveSensitivity"
              label="Move sensitivity"
              width="100%"
            />
          </Field.Root>

          <Field.Root>
            <Slider
              defaultValue={[scrollSensitivity]}
              min={1}
              step={0.1}
              max={10}
              showValue
              name="scrollSensitivity"
              label="Scroll sensitivity"
              width="100%"
            />
          </Field.Root>

          <Field.Root>
            <Slider
              defaultValue={[accelerationThreshold]}
              min={1}
              step={1}
              max={100}
              showValue
              name="accelerationThreshold"
              label="Acceleration threshold"
              width="100%"
            />
          </Field.Root>

          <Field.Root>
            <Slider
              defaultValue={[maxAccelerationFactor]}
              min={1}
              step={0.1}
              max={10}
              showValue
              name="maxAccelerationFactor"
              label="Max acceleration factor"
              width="100%"
            />
          </Field.Root>
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button onClick={() => navigate(-1)} variant="outline">
          Back
        </Button>
        <Button type="submit">Save</Button>
      </Card.Footer>
    </Card.Root>
  );
}
