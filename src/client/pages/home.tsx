import {
    ActionIcon,
    Anchor,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Container,
    CopyButton,
    Group,
    Loader,
    Paper,
    PasswordInput,
    Stack,
    Table,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import {
    IconCheck,
    IconCopy,
    IconExternalLink,
    IconHeart,
    IconHeartFilled,
    IconLogout2,
    IconMoodSmileBeam,
    IconPaw,
    IconPlus,
    IconSparkles,
    IconStar,
    IconStarFilled,
    IconTrash,
} from "@tabler/icons-react";
import { removePass, savePass, state } from "../lib/state";

interface Path {
    id: string;
    from: string;
    to: string;
}

// --- Kawaii Pastel tokens ---
const PINK = "#f8a4c8";
const LAVENDER = "#c4b0f5";
const MINT = "#a8e6cf";
const SKY = "#a0d2f7";
const PEACH = "#ffd4b8";
const CREAM = "#fff8f0";
const SOFT_WHITE = "#fefbff";
const CARD_BG = "#fff5fa";
const TABLE_BG = "#fdf2f8";
const BORDER = "#f0d4e4";
const TEXT_MAIN = "#6b4c6e";
const TEXT_SUB = "#b08db5";

const kawaiiCSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

@keyframes kawaii-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes kawaii-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
@keyframes kawaii-sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}
@keyframes kawaii-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes kawaii-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const kawaiiFont: React.CSSProperties = {
    fontFamily: "'Nunito', 'Rounded Mplus 1c', sans-serif",
};

const softShadow = "0 4px 20px rgba(248,164,200,0.15), 0 2px 8px rgba(196,176,245,0.1)";
const hoverShadow = "0 6px 28px rgba(248,164,200,0.25), 0 4px 12px rgba(196,176,245,0.15)";

export default function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [paths, setPaths] = useState<Path[]>([]);
    const [loading, setLoading] = useState(false);
    const [passInput, setPassInput] = useState("");
    const { pass } = useSnapshot(state);

    const fetchPaths = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/path/list?page=1&limit=20");
            const json = await res.json();
            setPaths(json.data ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaths();
    }, []);

    const createPath = async () => {
        if (!from.trim() || !to.trim()) return;
        const res = await fetch("/api/path/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to }),
        });
        const json = await res.json();
        if (json.success) {
            setFrom("");
            setTo("");
            fetchPaths();
        } else {
            alert(json.message || "Gagal membuat path");
        }
    };

    const deletePath = async (id: string) => {
        await fetch(`/api/path/remove?id=${id}`, { method: "DELETE" });
        fetchPaths();
    };

    const pastelColors = [PINK, LAVENDER, MINT, SKY, PEACH];
    const getRowAccent = (i: number) => pastelColors[i % pastelColors.length];

    // Login screen
    if (pass !== "Makuro_123") {
        return (
            <>
                <style>{kawaiiCSS}</style>
                <Box
                    style={{
                        minHeight: "100vh",
                        background: `linear-gradient(135deg, #fff0f6 0%, #f3e8ff 30%, #e8f4fd 60%, #fff0f6 100%)`,
                        backgroundSize: "400% 400%",
                        animation: "kawaii-gradient 12s ease infinite",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...kawaiiFont,
                    }}
                >
                    {/* Floating decorations */}
                    {["*", "*", "*", "*", "*"].map((_, i) => (
                        <Box
                            key={i}
                            style={{
                                position: "fixed",
                                top: `${15 + i * 18}%`,
                                left: `${8 + i * 20}%`,
                                animation: `kawaii-sparkle ${2 + i * 0.5}s ease-in-out infinite`,
                                animationDelay: `${i * 0.3}s`,
                                pointerEvents: "none",
                                opacity: 0.3,
                            }}
                        >
                            <IconStarFilled size={10 + i * 3} color={pastelColors[i]} />
                        </Box>
                    ))}

                    <Card
                        w={400}
                        padding="xl"
                        radius={24}
                        style={{
                            background: SOFT_WHITE,
                            boxShadow: softShadow,
                            border: `2px solid ${BORDER}`,
                            transition: "box-shadow 0.3s",
                        }}
                    >
                        <Stack align="center" gap="lg">
                            {/* Kawaii mascot area */}
                            <Box
                                style={{
                                    animation: "kawaii-float 3s ease-in-out infinite",
                                }}
                            >
                                <Box
                                    p="md"
                                    style={{
                                        background: `linear-gradient(135deg, ${PINK}33, ${LAVENDER}33)`,
                                        borderRadius: "50%",
                                        width: 72,
                                        height: 72,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <IconPaw size={36} color={PINK} stroke={1.8} />
                                </Box>
                            </Box>

                            <Stack gap={4} align="center">
                                <Text
                                    size="xl"
                                    fw={800}
                                    style={{
                                        ...kawaiiFont,
                                        color: TEXT_MAIN,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Selamat Datang~!
                                </Text>
                                <Text size="sm" style={{ color: TEXT_SUB, ...kawaiiFont }}>
                                    Masukkan password dulu ya~
                                </Text>
                            </Stack>

                            <PasswordInput
                                w="100%"
                                placeholder="Kata sandi rahasia..."
                                size="md"
                                radius={16}
                                value={passInput}
                                onChange={(e) => setPassInput(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (passInput.length > 4 && e.key === "Enter") {
                                        savePass(passInput);
                                        setPassInput("");
                                    }
                                }}
                                styles={{
                                    input: {
                                        background: CREAM,
                                        border: `2px solid ${BORDER}`,
                                        color: TEXT_MAIN,
                                        ...kawaiiFont,
                                        fontSize: 14,
                                        "&:focus": {
                                            borderColor: PINK,
                                        },
                                    },
                                }}
                            />

                            <Button
                                fullWidth
                                size="md"
                                radius={16}
                                disabled={passInput.length <= 4}
                                onClick={() => {
                                    savePass(passInput);
                                    setPassInput("");
                                }}
                                leftSection={<IconHeartFilled size={16} />}
                                styles={{
                                    root: {
                                        background: `linear-gradient(135deg, ${PINK}, ${LAVENDER})`,
                                        border: "none",
                                        color: "#fff",
                                        fontWeight: 700,
                                        ...kawaiiFont,
                                        fontSize: 15,
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-1px)",
                                            boxShadow: hoverShadow,
                                        },
                                        "&:disabled": {
                                            background: "#e8dce8",
                                            color: "#c0b0c0",
                                        },
                                    },
                                }}
                            >
                                Masuk~!
                            </Button>

                            {/* Decorative dots */}
                            <Group gap={6} justify="center">
                                {pastelColors.map((c, i) => (
                                    <Box
                                        key={i}
                                        w={6}
                                        h={6}
                                        style={{
                                            borderRadius: "50%",
                                            background: c,
                                            animation: `kawaii-bounce 1.5s ease-in-out infinite`,
                                            animationDelay: `${i * 0.15}s`,
                                        }}
                                    />
                                ))}
                            </Group>
                        </Stack>
                    </Card>
                </Box>
            </>
        );
    }

    // Main dashboard
    return (
        <>
            <style>{kawaiiCSS}</style>
            <Box
                style={{
                    minHeight: "100vh",
                    background: `linear-gradient(180deg, #fff0f6 0%, #f8f0ff 40%, #f0f4ff 70%, #fff5f9 100%)`,
                    padding: "28px 0",
                    ...kawaiiFont,
                }}
            >
                <Container size="lg">
                    <Stack gap="md">
                        {/* Header */}
                        <Paper
                            p="md"
                            radius={20}
                            style={{
                                background: SOFT_WHITE,
                                boxShadow: softShadow,
                                border: `2px solid ${BORDER}`,
                            }}
                        >
                            <Group justify="space-between" align="center">
                                <Group gap="sm">
                                    <Box
                                        style={{ animation: "kawaii-wiggle 2s ease-in-out infinite" }}
                                    >
                                        <IconPaw size={24} color={PINK} stroke={1.8} />
                                    </Box>
                                    <Text
                                        size="lg"
                                        fw={800}
                                        style={{
                                            color: TEXT_MAIN,
                                            ...kawaiiFont,
                                        }}
                                    >
                                        Path Manager
                                    </Text>
                                    <IconSparkles
                                        size={16}
                                        color={LAVENDER}
                                        style={{ animation: "kawaii-sparkle 2s ease-in-out infinite" }}
                                    />
                                </Group>

                                <Button
                                    variant="light"
                                    size="xs"
                                    radius={12}
                                    leftSection={<IconLogout2 size={14} />}
                                    onClick={removePass}
                                    styles={{
                                        root: {
                                            background: `${PINK}18`,
                                            color: PINK,
                                            border: `1.5px solid ${PINK}44`,
                                            fontWeight: 700,
                                            ...kawaiiFont,
                                            "&:hover": {
                                                background: `${PINK}28`,
                                            },
                                        },
                                    }}
                                >
                                    Keluar~
                                </Button>
                            </Group>
                        </Paper>

                        {/* Create form */}
                        <Paper
                            p="lg"
                            radius={20}
                            style={{
                                background: SOFT_WHITE,
                                boxShadow: softShadow,
                                border: `2px solid ${BORDER}`,
                            }}
                        >
                            <Group gap="xs" mb="sm">
                                <IconStar size={16} color={PEACH} />
                                <Text fw={700} size="sm" style={{ color: TEXT_MAIN, ...kawaiiFont }}>
                                    Buat Path Baru~!
                                </Text>
                            </Group>

                            <Group align="end" grow>
                                <TextInput
                                    label={
                                        <Text size="xs" fw={700} style={{ color: TEXT_SUB, ...kawaiiFont }}>
                                            Dari
                                        </Text>
                                    }
                                    placeholder="contoh: link-ku"
                                    radius={14}
                                    value={from}
                                    onChange={(e) => setFrom(e.currentTarget.value)}
                                    styles={{
                                        input: {
                                            background: CREAM,
                                            border: `2px solid ${BORDER}`,
                                            color: TEXT_MAIN,
                                            ...kawaiiFont,
                                            "&:focus": { borderColor: LAVENDER },
                                        },
                                    }}
                                />
                                <TextInput
                                    label={
                                        <Text size="xs" fw={700} style={{ color: TEXT_SUB, ...kawaiiFont }}>
                                            Tujuan
                                        </Text>
                                    }
                                    placeholder="https://example.com/tujuan"
                                    radius={14}
                                    value={to}
                                    onChange={(e) => setTo(e.currentTarget.value)}
                                    onKeyDown={(e) => e.key === "Enter" && createPath()}
                                    styles={{
                                        input: {
                                            background: CREAM,
                                            border: `2px solid ${BORDER}`,
                                            color: TEXT_MAIN,
                                            ...kawaiiFont,
                                            "&:focus": { borderColor: LAVENDER },
                                        },
                                    }}
                                />
                                <Button
                                    leftSection={<IconPlus size={15} />}
                                    radius={14}
                                    onClick={createPath}
                                    disabled={!from.trim() || !to.trim()}
                                    style={{ flexGrow: 0, flexBasis: "auto" }}
                                    styles={{
                                        root: {
                                            background: `linear-gradient(135deg, ${MINT}, ${SKY})`,
                                            border: "none",
                                            color: "#fff",
                                            fontWeight: 700,
                                            ...kawaiiFont,
                                            transition: "all 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-1px)",
                                                boxShadow: `0 4px 16px ${MINT}66`,
                                            },
                                            "&:disabled": {
                                                background: "#e0dce0",
                                                color: "#bbb",
                                            },
                                        },
                                    }}
                                >
                                    Buat~!
                                </Button>
                            </Group>
                        </Paper>

                        {/* Table */}
                        <Paper
                            radius={20}
                            style={{
                                background: SOFT_WHITE,
                                boxShadow: softShadow,
                                border: `2px solid ${BORDER}`,
                                overflow: "hidden",
                            }}
                        >
                            {/* Table title bar */}
                            <Group
                                px="lg"
                                py="sm"
                                justify="space-between"
                                style={{
                                    background: `linear-gradient(135deg, ${PINK}15, ${LAVENDER}15)`,
                                    borderBottom: `2px solid ${BORDER}`,
                                }}
                            >
                                <Group gap="xs">
                                    <IconMoodSmileBeam size={18} color={PINK} />
                                    <Text fw={700} size="sm" style={{ color: TEXT_MAIN, ...kawaiiFont }}>
                                        Semua Path
                                    </Text>
                                </Group>
                                <Badge
                                    radius={10}
                                    size="sm"
                                    styles={{
                                        root: {
                                            background: `${LAVENDER}33`,
                                            color: LAVENDER,
                                            fontWeight: 700,
                                            border: `1.5px solid ${LAVENDER}55`,
                                            ...kawaiiFont,
                                        },
                                    }}
                                >
                                    {paths.length} buah
                                </Badge>
                            </Group>

                            {loading ? (
                                <Center p="xl">
                                    <Group gap="sm">
                                        <Loader size="xs" color={PINK} type="dots" />
                                        <Text size="sm" style={{ color: TEXT_SUB, ...kawaiiFont }}>
                                            Tunggu sebentar ya~...
                                        </Text>
                                    </Group>
                                </Center>
                            ) : paths.length === 0 ? (
                                <Center p={40}>
                                    <Stack align="center" gap="sm">
                                        <Box style={{ animation: "kawaii-float 3s ease-in-out infinite" }}>
                                            <IconHeart size={36} color={`${PINK}88`} stroke={1.5} />
                                        </Box>
                                        <Text size="sm" fw={600} style={{ color: TEXT_SUB, ...kawaiiFont }}>
                                            Belum ada path nih~
                                        </Text>
                                        <Text size="xs" style={{ color: `${TEXT_SUB}88`, ...kawaiiFont }}>
                                            Yuk buat yang pertama di atas!
                                        </Text>
                                    </Stack>
                                </Center>
                            ) : (
                                <Table.ScrollContainer minWidth={600}>
                                    <Table
                                        verticalSpacing="sm"
                                        horizontalSpacing="md"
                                        styles={{
                                            th: {
                                                ...kawaiiFont,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: TEXT_SUB,
                                                textTransform: "uppercase",
                                                letterSpacing: 1,
                                                borderBottom: `2px solid ${BORDER}`,
                                                background: "transparent",
                                                padding: "12px 16px",
                                            },
                                            td: {
                                                ...kawaiiFont,
                                                fontSize: 14,
                                                color: TEXT_MAIN,
                                                borderBottom: `1.5px solid ${BORDER}`,
                                                padding: "12px 16px",
                                            },
                                            tr: {
                                                transition: "background 0.2s",
                                                "&:hover": {
                                                    background: `${PINK}08 !important`,
                                                },
                                            },
                                        }}
                                    >
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th w={50}>#</Table.Th>
                                                <Table.Th>Dari</Table.Th>
                                                <Table.Th>Tujuan</Table.Th>
                                                <Table.Th w={120} style={{ textAlign: "right" }}>
                                                    Aksi
                                                </Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {paths.map((p, i) => (
                                                <Table.Tr key={p.id}>
                                                    <Table.Td>
                                                        <Box
                                                            w={26}
                                                            h={26}
                                                            style={{
                                                                borderRadius: "50%",
                                                                background: `${getRowAccent(i)}33`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <Text
                                                                size="xs"
                                                                fw={700}
                                                                style={{ color: getRowAccent(i) }}
                                                            >
                                                                {i + 1}
                                                            </Text>
                                                        </Box>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Badge
                                                            radius={10}
                                                            size="md"
                                                            leftSection={
                                                                <IconStarFilled
                                                                    size={10}
                                                                    color={getRowAccent(i)}
                                                                />
                                                            }
                                                            styles={{
                                                                root: {
                                                                    background: `${getRowAccent(i)}22`,
                                                                    color: TEXT_MAIN,
                                                                    border: `1.5px solid ${getRowAccent(i)}55`,
                                                                    fontWeight: 700,
                                                                    ...kawaiiFont,
                                                                },
                                                            }}
                                                        >
                                                            /{p.from}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Anchor
                                                            href={p.to.match(/^https?:\/\//) ? p.to : `https://${p.to}`}
                                                            target="_blank"
                                                            size="sm"
                                                            style={{
                                                                color: LAVENDER,
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: 5,
                                                                textDecoration: "none",
                                                                fontWeight: 600,
                                                                ...kawaiiFont,
                                                                transition: "color 0.2s",
                                                            }}
                                                        >
                                                            {p.to.length > 45
                                                                ? p.to.slice(0, 45) + "..."
                                                                : p.to}
                                                            <IconExternalLink
                                                                size={13}
                                                                color={`${LAVENDER}88`}
                                                            />
                                                        </Anchor>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Group gap={6} justify="flex-end">
                                                            <CopyButton
                                                                value={`${window.location.origin}/${p.from}`}
                                                            >
                                                                {({ copied, copy }) => (
                                                                    <Tooltip
                                                                        label={
                                                                            copied
                                                                                ? "Tersalin~!"
                                                                                : "Salin link"
                                                                        }
                                                                        withArrow
                                                                        radius={8}
                                                                        styles={{
                                                                            tooltip: {
                                                                                ...kawaiiFont,
                                                                                fontSize: 11,
                                                                                fontWeight: 600,
                                                                                background: SOFT_WHITE,
                                                                                border: `1.5px solid ${BORDER}`,
                                                                                color: TEXT_MAIN,
                                                                                boxShadow: softShadow,
                                                                            },
                                                                        }}
                                                                    >
                                                                        <ActionIcon
                                                                            variant="subtle"
                                                                            size="md"
                                                                            radius={10}
                                                                            onClick={copy}
                                                                            style={{
                                                                                background: copied
                                                                                    ? `${MINT}33`
                                                                                    : `${SKY}22`,
                                                                                border: `1.5px solid ${copied ? MINT : SKY}55`,
                                                                                color: copied
                                                                                    ? MINT
                                                                                    : SKY,
                                                                                transition: "all 0.2s",
                                                                            }}
                                                                        >
                                                                            {copied ? (
                                                                                <IconCheck size={15} />
                                                                            ) : (
                                                                                <IconCopy size={15} />
                                                                            )}
                                                                        </ActionIcon>
                                                                    </Tooltip>
                                                                )}
                                                            </CopyButton>
                                                            <Tooltip
                                                                label="Hapus"
                                                                withArrow
                                                                radius={8}
                                                                styles={{
                                                                    tooltip: {
                                                                        ...kawaiiFont,
                                                                        fontSize: 11,
                                                                        fontWeight: 600,
                                                                        background: SOFT_WHITE,
                                                                        border: `1.5px solid ${BORDER}`,
                                                                        color: TEXT_MAIN,
                                                                        boxShadow: softShadow,
                                                                    },
                                                                }}
                                                            >
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    size="md"
                                                                    radius={10}
                                                                    onClick={() => deletePath(p.id)}
                                                                    style={{
                                                                        background: `${PINK}18`,
                                                                        border: `1.5px solid ${PINK}44`,
                                                                        color: PINK,
                                                                        transition: "all 0.2s",
                                                                    }}
                                                                >
                                                                    <IconTrash size={15} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Table.ScrollContainer>
                            )}
                        </Paper>

                        {/* Footer */}
                        <Stack align="center" gap={6}>
                            <Group gap={4} justify="center">
                                {pastelColors.map((c, i) => (
                                    <Box
                                        key={i}
                                        w={6}
                                        h={6}
                                        style={{
                                            borderRadius: "50%",
                                            background: c,
                                            animation: `kawaii-bounce 1.5s ease-in-out infinite`,
                                            animationDelay: `${i * 0.12}s`,
                                        }}
                                    />
                                ))}
                            </Group>
                            <Text size="xs" fw={600} style={{ color: `${TEXT_SUB}88`, ...kawaiiFont }}>
                                Total: {paths.length} path terdaftar~!
                            </Text>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}
